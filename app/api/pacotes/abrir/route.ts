import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route"; 

export async function POST() {
  try {

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
    }

    const USER_ID = session.user.email;

    const pacote = await prisma.pacote.findFirst({
      where: {
        userId: USER_ID,
        aberto: false,
      },
    });

    if (!pacote) {
      return NextResponse.json(
        { error: "Sem pacotes disponíveis" },
        { status: 400 },
      );
    }


    const todasFigurinhas = await prisma.figurinha.findMany();

    if (todasFigurinhas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma figurinha cadastrada" },
        { status: 400 },
      );
    }

    const raras = todasFigurinhas.filter((f) => f.isRara);
    const comuns = todasFigurinhas.filter((f) => !f.isRara);

    const sorteadas = [];

    for (let i = 0; i < 5; i++) {
      const ehRara = Math.random() < 0.15;
      let pool = ehRara ? raras : comuns;

      if (pool.length === 0) {
        pool = todasFigurinhas;
      }

      const fig = pool[Math.floor(Math.random() * pool.length)];
      sorteadas.push(fig);
    }

    await prisma.$transaction([
      prisma.pacote.update({
        where: {
          id: pacote.id,
        },
        data: {
          aberto: true,
        },
      }),

      ...sorteadas.map((fig) =>
        prisma.colecao.upsert({
          where: {
            userId_figurinhaId: {
              userId: USER_ID,
              figurinhaId: fig.id,
            },
          },
          update: {
            quantidade: {
              increment: 1,
            },
          },
          create: {
            userId: USER_ID,
            figurinhaId: fig.id,
            quantidade: 1,
          },
        }),
      ),
    ]);

    return NextResponse.json({
      figurinhas: sorteadas,
    });
  } catch (error) {
    console.error("[PACOTE_ABRIR]", error);

    return NextResponse.json(
      { error: "Erro ao abrir pacote" },
      { status: 500 },
    );
  }
}
