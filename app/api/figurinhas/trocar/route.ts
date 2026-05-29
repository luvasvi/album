import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const session = await getServerSession();

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

    if (emailDoador === emailDestino) {
      return NextResponse.json(
        { error: "Você não pode enviar uma figurinha para você mesmo." },
        { status: 400 },
      );
    }

    const posseDoador = await prisma.colecao.findFirst({
      where: {
        userId: emailDoador,
        figurinhaId: figurinhaId,
      },
    });

    if (!posseDoador || posseDoador.quantidade <= 1) {
      return NextResponse.json(
        {
          error:
            "Você não tem cópias repetidas desta figurinha para transferir.",
        },
        { status: 400 },
      );
    }

    const posseReceptor = await prisma.colecao.findFirst({
      where: {
        userId: emailDestino,
        figurinhaId: figurinhaId,
      },
    });

    await prisma.$transaction([

      prisma.colecao.update({
        where: { id: posseDoador.id },
        data: {
          quantidade: { decrement: 1 },
        },
      }),

      posseReceptor
        ? prisma.colecao.update({
            where: { id: posseReceptor.id },
            data: {
              quantidade: { increment: 1 },
            },
          })
        : prisma.colecao.create({
            data: {
              userId: emailDestino,
              figurinhaId: figurinhaId,
              quantidade: 1,
            },
          }),
    ]);

    return NextResponse.json({
      success: true,
      mensagem: "Figurinha enviada com sucesso!",
    });
  } catch (error) {
    console.error("Erro na rota de troca:", error);
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
