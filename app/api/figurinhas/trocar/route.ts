import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {

  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const emailDoador: string = session.user.email;

  try {
    const { figurinhaId, emailDestino } = await request.json();

    if (!figurinhaId || !emailDestino) {
      return NextResponse.json(
        { error: "Dados incompletos para a troca" },
        { status: 400 },
      );
    }

    if (emailDoador === emailDestino) {
      return NextResponse.json(
        { error: "Você não pode enviar uma figurinha para você mesmo." },
        { status: 400 },
      );
    }

    const userClient = (prisma as any).user || (prisma as any).User;


    const receptorExiste = await userClient.findUnique({
      where: { email: emailDestino },
    });

    if (!receptorExiste) {
      return NextResponse.json(
        { error: "Este colaborador não está cadastrado no sistema do álbum." },
        { status: 404 },
      );
    }


    const resultadoTransacao = await prisma.$transaction(async (tx) => {

      const posseDoador = await tx.colecao.findFirst({
        where: {
          userId: emailDoador,
          figurinhaId: figurinhaId,
        },
      });

      if (!posseDoador || posseDoador.quantidade <= 1) {
        throw new Error("SEM_REPETIDAS");
      }

      await tx.colecao.update({
        where: { id: posseDoador.id },
        data: {
          quantidade: { decrement: 1 },
        },
      });

      const colecaoClient = (tx as any).colecao || (tx as any).Colecao;

      await colecaoClient.upsert({
        where: {
          userId_figurinhaId: {
            userId: emailDestino,
            figurinhaId: figurinhaId,
          },
        },
        update: {
          quantidade: { increment: 1 },
        },
        create: {
          userId: emailDestino,
          figurinhaId: figurinhaId,
          quantidade: 1,
        },
      });

      return { success: true };
    });

    return NextResponse.json({
      success: true,
      mensagem: "Figurinha enviada com sucesso!",
    });

  } catch (error: any) {

    if (error.message === "SEM_REPETIDAS") {
      return NextResponse.json(
        { error: "Você não tem cópias repetidas desta figurinha para transferir." },
        { status: 400 },
      );
    }

    console.error("Erro crítico na rota de troca:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor ao transferir" },
      { status: 500 },
    );
  }
}