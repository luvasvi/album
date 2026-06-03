import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {

  const session = await getServerSession(authOptions);

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

    const todasFigurinhas = await prisma.figurinha.findMany({
      select: {
        id: true,
        numero: true,
        nome: true,
        cargo: true,
        area: true,
        emoji: true,
        imagem: true,
      },
    });

    if (todasFigurinhas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma figurinha no sistema" },
        { status: 500 },
      );
    }

    const respostaLote = await prisma.$transaction(async (tx) => {
      
      const pacotesFechados = await tx.pacote.findMany({
        where: { userId: emailUsuario, aberto: false },
        take: qtdParaAbrir,
        select: { id: true },
      });

      if (pacotesFechados.length < qtdParaAbrir) {
        throw new Error("SALDO_INSUFICIENTE");
      }

      const idsPacotes = pacotesFechados.map((p) => p.id);

      await tx.pacote.updateMany({
        where: { id: { in: idsPacotes } },
        data: { aberto: true },
      });

      const mapaSorteio: Record<string, number> = {};
      const figurinhasSorteadasParaOFront: any[] = [];
      const totalFigurinhasSorteadas = idsPacotes.length * 5;

      for (let i = 0; i < totalFigurinhasSorteadas; i++) {
        const sorteada = todasFigurinhas[Math.floor(Math.random() * todasFigurinhas.length)];

        mapaSorteio[sorteada.id] = (mapaSorteio[sorteada.id] || 0) + 1;
        figurinhasSorteadasParaOFront.push(sorteada);
      }

      const colecaoClient = (tx as any).colecao || (tx as any).Colecao;

      const operacoesUpsert = Object.entries(mapaSorteio).map(
        ([figurinhaId, qtdSorteada]) => {
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

      return {
        totalAbertos: idsPacotes.length,
        listaFront: figurinhasSorteadasParaOFront,
      };
    });

    return NextResponse.json({
      success: true,
      mensagem: `🎉 ${respostaLote.totalAbertos} pacotes abertos!`,
      figurinhas: respostaLote.listaFront,
    });

  } catch (error: any) {
    if (error.message === "SALDO_INSUFICIENTE") {
      return NextResponse.json(
        { error: "Você não possui a quantidade de pacotes fechados necessária." },
        { status: 400 },
      );
    }

    console.error("Erro ao abrir pacotes em massa:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao processar o lote" },
      { status: 500 },
    );
  }
}