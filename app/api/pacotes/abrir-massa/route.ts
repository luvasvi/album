import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(req: Request) {
  const session = await getServerSession();

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const emailUsuario = session.user.email;

  try {
    const { quantidade } = await req.json();
    const qtdParaAbrir = parseInt(quantidade);

    if (isNaN(qtdParaAbrir) || qtdParaAbrir <= 0) {
      return NextResponse.json(
        { error: "Quantidade inválida" },
        { status: 400 },
      );
    }

    // 1. Busca os pacotes fechados
    const pacotesFechados = await prisma.pacote.findMany({
      where: { userId: emailUsuario, aberto: false },
      take: qtdParaAbrir,
      select: { id: true },
    });

    if (pacotesFechados.length === 0) {
      return NextResponse.json(
        { error: "Você não tem pacotes fechados" },
        { status: 400 },
      );
    }

    const idsPacotes = pacotesFechados.map((p) => p.id);

    // 2. Busca todas as figurinhas para o sorteio
    const todasFigurinhas = await prisma.figurinha.findMany({
      select: { id: true, isRara: true },
    });

    if (todasFigurinhas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma figurinha no sistema" },
        { status: 500 },
      );
    }

    // 🔥 MAPA DE AGRUPAMENTO NA MEMÓRIA: Evita o loop exaustivo no banco
    // Estrutura: { [figurinhaId]: quantidadeSorteada }
    const mapaSorteio: Record<string, number> = {};
    const totalFigurinhasSorteadas = idsPacotes.length * 5;

    for (let i = 0; i < totalFigurinhasSorteadas; i++) {
      const eRara = Math.random() < 0.15;
      const filtradas = todasFigurinhas.filter((f) => f.isRara === eRara);
      const listaSorteio = filtradas.length > 0 ? filtradas : todasFigurinhas;

      const sorteada =
        listaSorteio[Math.floor(Math.random() * listaSorteio.length)];

      // Incrementa a quantidade no objeto local do Node
      mapaSorteio[sorteada.id] = (mapaSorteio[sorteada.id] || 0) + 1;
    }

    // 3. Executa as atualizações sequenciais sem travar transações longas
    // Passo A: Seta os pacotes abertos de uma vez só
    await prisma.pacote.updateMany({
      where: { id: { in: idsPacotes } },
      data: { aberto: true },
    });

    // Passo B: Descarrega o mapa agrupado para o banco usando Promessas Paralelas
    // Se o usuário sorteou a mesma figurinha 10 vezes, faremos apenas 1 requisição para ela!
    const operacoesUpsert = Object.entries(mapaSorteio).map(
      ([figurinhaId, qtdSorteada]) => {
        const colecaoClient =
          (prisma as any).colecao || (prisma as any).Colecao;

        return colecaoClient.upsert({
          where: {
            userId_figurinhaId: {
              userId: emailUsuario,
              figurinhaId: figurinhaId,
            },
          },
          update: {
            quantidade: { increment: qtdSorteada },
          },
          create: {
            userId: emailUsuario,
            figurinhaId: figurinhaId,
            quantidade: qtdSorteada,
          },
        });
      },
    );

    await Promise.all(operacoesUpsert);

    return NextResponse.json({
      success: true,
      mensagem: `🎉 ${idsPacotes.length} pacotes abertos de uma vez só! ${totalFigurinhasSorteadas} figurinhas adicionadas à sua coleção.`,
    });
  } catch (error) {
    console.error("Erro ao abrir pacotes em massa:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
