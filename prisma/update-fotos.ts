import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  
  const NOME_DO_COLABORADOR = "ademar tenorio";
  const NOVA_FOTO = "https://res.cloudinary.com/dyxr9ng0a/image/upload/q_auto/f_auto/v1780073263/ademartenorio_cvawcl.png"
  console.log(
    `🔍 Procurando por figurinhas que contenham o nome: "${NOME_DO_COLABORADOR}"...`,
  );

  const figurinha = await prisma.figurinha.findFirst({
    where: {
      nome: {
        contains: NOME_DO_COLABORADOR,
        mode: "insensitive",
      },
    },
  });

  if (!figurinha) {
    console.error(
      `❌ Erro: Nenhuma figurinha encontrada com o nome "${NOME_DO_COLABORADOR}".`,
    );
    return;
  }

  console.log(
    `📸 Figurinha encontrada: "${figurinha.nome}" (#${figurinha.numero}) do setor ${figurinha.area}.`,
  );
  console.log("⏳ Aplicando nova imagem...");

  const atualizada = await prisma.figurinha.update({
    where: { id: figurinha.id },
    data: {
      imagem: NOVA_FOTO,
    },
  });

  console.log(
    `✅ Sucesso! A foto de "${atualizada.nome}" foi atualizada para: "${atualizada.imagem}".`,
  );
}

main()
  .catch((e) => console.error("❌ Erro na execução do script:", e))
  .finally(async () => await prisma.$disconnect());
