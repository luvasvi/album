import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 💡 DIGITE O EMAIL DO USUÁRIO QUE VOCÊ QUER APAGAR
const EMAIL_PARA_DELETAR = "luvasvieira17@gmail.com";

async function main() {
  console.log(
    `⏳ Iniciando processo de exclusão para: ${EMAIL_PARA_DELETAR}...`,
  );

  // 1. Busca se o usuário realmente existe
  const usuario = await prisma.user.findUnique({
    where: { email: EMAIL_PARA_DELETAR },
  });

  if (!usuario) {
    console.error("❌ Erro: Usuário não encontrado no banco de dados.");
    return;
  }

  // 2. Executa a limpeza em cascata sequencial
  console.log("🧹 Limpando dados vinculados...");

  // Remove os registros da coleção de figurinhas dele
  const colecao = await prisma.colecao.deleteMany({
    where: { userId: EMAIL_PARA_DELETAR },
  });
  console.log(`   -> ${colecao.count} registros de figurinhas removidos.`);

  // Remove os pacotes vinculados a ele
  const pacotes = await prisma.pacote.deleteMany({
    where: { userId: EMAIL_PARA_DELETAR },
  });
  console.log(`   -> ${pacotes.count} pacotes deletados.`);

  // Se você usar o NextAuth padrão com a tabela Account vinculada
  if ((prisma as any).account) {
    await (prisma as any).account.deleteMany({
      where: { userId: usuario.id },
    });
    console.log("   -> Contas de provedores externos (Google) desconectadas.");
  }

  // 3. Por fim, apaga o documento principal do Usuário
  await prisma.user.delete({
    where: { id: usuario.id },
  });

  console.log(
    `✅ Sucesso total! O usuário ${EMAIL_PARA_DELETAR} foi completamente removido do sistema.`,
  );
}

main()
  .catch((e) => console.error("❌ Erro na execução do script:", e))
  .finally(async () => await prisma.$disconnect());
