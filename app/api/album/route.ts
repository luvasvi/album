// src/app/api/album/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const USER_ID = "demo-user";

export async function GET() {
  try {
    // Busca tudo em paralelo
    const [figurinhas, colecao, totalPacotes] = await Promise.all([
      prisma.figurinha.findMany({
        orderBy: {
          numero: "asc",
        },
      }),

      prisma.colecao.findMany({
        where: {
          userId: USER_ID,
        },
      }),

      prisma.pacote.count({
        where: {
          userId: USER_ID,
          aberto: false,
        },
      }),
    ]);

    // Map da coleção
    const colecaoMap = new Map(
      colecao.map((item) => [item.figurinhaId, item.quantidade]),
    );

    // Junta figurinhas + posse
    const figurinhasComPosse = figurinhas.map((fig) => {
      const quantidade = colecaoMap.get(fig.id) ?? 0;

      return {
        id: fig.id,
        numero: fig.numero,
        nome: fig.nome,
        cargo: fig.cargo,
        area: fig.area,
        emoji: fig.emoji,
        isRara: fig.isRara,
        possui: quantidade > 0,

        quantidade,
      };
    });

    return NextResponse.json({
      figurinhas: figurinhasComPosse,
      totalPacotes,
      totalPossuidas: colecao.length,
      totalFigurinhas: figurinhas.length,
    });
  } catch (error) {
    console.error("[ALBUM_GET]", error);

    return NextResponse.json(
      {
        error: "Erro ao carregar álbum",
      },
      {
        status: 500,
      },
    );
  }
}
