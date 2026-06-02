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

    const todasFigurinhas = await prisma.figurinha.findMany({
      select: {
        id: true,
        numero: true,
        nome: true,
        cargo: true,
        area: true,
        emoji: true,
        imagem: true,
        isRara: true,
      },
    });

    if (todasFigurinhas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma figurinha no sistema" },
        { status: 500 },
      );
    }

    const mapaSorteio: Record<string, number> = {};
    const totalFigurinhasSorteadas = idsPacotes.length * 5;

    const figurinhasSorteadasParaOFront: any[] = [];

    for (let i = 0; i < totalFigurinhasSorteadas; i++) {
      const eRara = Math.random() < 0.15;
      const filtradas = todasFigurinhas.filter((f) => f.isRara === eRara);
      const listaSorteio = filtradas.length > 0 ? filtradas : todasFigurinhas;

      const sorteada =
        listaSorteio[Math.floor(Math.random() * listaSorteio.length)];

      mapaSorteio[sorteada.id] = (mapaSorteio[sorteada.id] || 0) + 1;

      figurinhasSorteadasParaOFront.push(sorteada);
    }

    await prisma.pacote.updateMany({
      where: { id: { in: idsPacotes } },
      data: { aberto: true },
    });

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
      mensagem: `🎉 ${idsPacotes.length} pacotes abertos!`,
      figurinhas: figurinhasSorteadasParaOFront,
    });
  } catch (error) {
    console.error("Erro ao abrir pacotes em massa:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
