import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST() {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Não autenticado ou e-mail ausente" },
      { status: 401 },
    );
  }

  const emailUsuario: string = session.user.email;

  try {
    const userClient = (prisma as any).user || (prisma as any).User;

    if (!userClient) {
      return NextResponse.json(
        { error: "Modelo User não encontrado no Prisma" },
        { status: 500 },
      );
    }

    const usuario = await userClient.findUnique({
      where: { email: emailUsuario },
    });

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 },
      );
    }

    const AGORA = new Date();
    const TEMPO_COOLDOWN = 4 * 60 * 60 * 1000;


    const ultimaDataResgate = usuario.ultimoResgate
      ? new Date(usuario.ultimoResgate)
      : new Date(AGORA.getTime() - TEMPO_COOLDOWN);

    const tempoPassado = AGORA.getTime() - ultimaDataResgate.getTime();

    if (tempoPassado < TEMPO_COOLDOWN) {
      const dataProximoResgate = new Date(
        ultimaDataResgate.getTime() + TEMPO_COOLDOWN,
      );

      return NextResponse.json(
        {
          error: "Cooldown ativo",
          proximoResgate: dataProximoResgate.toISOString(),
        },
        { status: 400 },
      );
    }

    const multiplicadorPacotes = Math.floor(tempoPassado / TEMPO_COOLDOWN);
    
    const pacotesAGanhar = multiplicadorPacotes * 5;


    const usuarioAtualizado = await userClient.updateMany({
      where: {
        id: usuario.id,
        ultimoResgate: usuario.ultimoResgate,
      },
      data: {
        ultimoResgate: AGORA,
      },
    });

    if (usuarioAtualizado.count === 0) {
      return NextResponse.json(
        { error: "Requisição duplicada já processada." },
        { status: 409 },
      );
    }

    const novosPacotes = Array.from({ length: pacotesAGanhar }).map(() => ({
      userId: emailUsuario,
      aberto: false,
      createdAt: AGORA,
    }));

    const pacoteClient = (prisma as any).pacote || (prisma as any).Pacote;
    await pacoteClient.createMany({ data: novosPacotes });

    return NextResponse.json({
      success: true,
      mensagem: `🎉 Sucesso! Você ganhou mais ${pacotesAGanhar} pacotes.`,
      ultimoResgate: AGORA.toISOString(),
    });

  } catch (error) {
    console.error("Erro interno ao processar resgate:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao gerar pacotes" },
      { status: 500 },
    );
  }
}