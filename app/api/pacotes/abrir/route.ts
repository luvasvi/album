import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const USER_ID = session.user.email;

    const todasFigurinhas = await prisma.figurinha.findMany();

    if (todasFigurinhas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma figurinha cadastrada no sistema" },
        { status: 500 },
      );
    }

    const sorteadas = await prisma.$transaction(async (tx) => {
      
      const pacote = await tx.pacote.findFirst({
        where: {
          userId: USER_ID,
          aberto: false,
        },
      });

      if (!pacote) {
        throw new Error("SEM_PACOTES");
      }

      await tx.pacote.update({
        where: { id: pacote.id },
        data: { aberto: true },
      });

      const poolSorteadas = [];
      for (let i = 0; i < 5; i++) {
        const fig = todasFigurinhas[Math.floor(Math.random() * todasFigurinhas.length)];
        poolSorteadas.push(fig);
      }

      const colecaoClient = (tx as any).colecao || (tx as any).Colecao;

      for (const fig of poolSorteadas) {
        await colecaoClient.upsert({
          where: {
            userId_figurinhaId: {
              userId: USER_ID,
              figurinhaId: fig.id,
            },
          },
          update: {
            quantidade: { increment: 1 },
          },
          create: {
            userId: USER_ID,
            figurinhaId: fig.id,
            quantidade: 1,
          },
        });
      }

      return poolSorteadas;
    });

    return NextResponse.json({
      figurinhas: sorteadas,
    });

  } catch (error: any) {
    if (error.message === "SEM_PACOTES") {
      return NextResponse.json(
        { error: "Você não tem pacotes disponíveis para abrir." },
        { status: 400 },
      );
    }

    console.error("[PACOTE_ABRIR]", error);

    return NextResponse.json(
      { error: "Erro interno ao abrir pacote" },
      { status: 500 },
    );
  }
}