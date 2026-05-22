// src/app/api/pacotes/abrir/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_ID = "demo-user";

export async function POST() {
  try {
    // Busca um pacote fechado do usuário
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

    // Busca todas as figurinhas
    const todasFigurinhas = await prisma.figurinha.findMany();

    if (todasFigurinhas.length === 0) {
      return NextResponse.json(
        { error: "Nenhuma figurinha cadastrada" },
        { status: 400 },
      );
    }

    // Pools separadas
    const raras = todasFigurinhas.filter((f) => f.isRara);

    const comuns = todasFigurinhas.filter((f) => !f.isRara);

    // Sorteio
    const sorteadas = [];

    for (let i = 0; i < 5; i++) {
      const ehRara = Math.random() < 0.15;

      let pool = ehRara ? raras : comuns;

      // fallback
      if (pool.length === 0) {
        pool = todasFigurinhas;
      }

      const fig = pool[Math.floor(Math.random() * pool.length)];

      sorteadas.push(fig);
    }

    // Atualiza coleção + pacote
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
      {
        error: "Erro ao abrir pacote",
      },
      {
        status: 500,
      },
    );
  }
}
