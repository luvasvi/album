// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const figurinhas = [
    {
      numero: 1,
      nome: "Lucas Vieira",
      cargo: "Jovem Aprendiz",
      area: "Tech",
      emoji: "👨‍💻",
      isRara: false,
    },
    {
      numero: 2,
      nome: "Layla Lucely",
      cargo: "Jovem Aprendiz",
      area: "RH",
      emoji: "👩‍💼",
      isRara: false,
    },
    {
      numero: 3,
      nome: "Ana Clara",
      cargo: "Head Eng",
      area: "Tech",
      emoji: "👩‍💻",
      isRara: true,
    },
    {
      numero: 4,
      nome: "Pedro Silva",
      cargo: "Dev",
      area: "Tech",
      emoji: "👨‍💻",
      isRara: false,
    },
    {
      numero: 5,
      nome: "Marta Rocha",
      cargo: "Designer",
      area: "Marketing",
      emoji: "🎨",
      isRara: false,
    },
    {
      numero: 6,
      nome: "João Paulo",
      cargo: "Analista",
      area: "Financeiro",
      emoji: "📊",
      isRara: false,
    },
    {
      numero: 7,
      nome: "Carla Mendes",
      cargo: "Tech Lead",
      area: "Tech",
      emoji: "🚀",
      isRara: true,
    },
    {
      numero: 8,
      nome: "Rafael Souza",
      cargo: "Recruiter",
      area: "RH",
      emoji: "🤝",
      isRara: false,
    },
    {
      numero: 9,
      nome: "Beatriz Lima",
      cargo: "Growth",
      area: "Marketing",
      emoji: "📈",
      isRara: false,
    },
    {
      numero: 10,
      nome: "Diego Santos",
      cargo: "Controller",
      area: "Financeiro",
      emoji: "💰",
      isRara: false,
    },
    {
      numero: 11,
      nome: "Fernanda Costa",
      cargo: "CEO",
      area: "Tech",
      emoji: "👑",
      isRara: true,
    },
    {
      numero: 12,
      nome: "Marcos Alves",
      cargo: "DevOps",
      area: "Tech",
      emoji: "⚙️",
      isRara: false,
    },
  ];

  console.log("🌱 Seeding figurinhas...");
  for (const fig of figurinhas) {
    await prisma.figurinha.upsert({
      where: { numero: fig.numero },
      update: {},
      create: fig,
    });
  }

  // Seed de pacotes para o usuário demo
  console.log("📦 Seeding pacotes...");
  for (let i = 0; i < 5; i++) {
    await prisma.pacote.create({
      data: { userId: "demo-user", aberto: false },
    });
  }

  // Seed de coleção demo (possui a figurinha #1 e #3)
  const fig1 = await prisma.figurinha.findUnique({ where: { numero: 1 } });
  const fig3 = await prisma.figurinha.findUnique({ where: { numero: 3 } });

  if (fig1 && fig3) {
    await prisma.colecao.upsert({
      where: {
        userId_figurinhaId: { userId: "demo-user", figurinhaId: fig1.id },
      },
      update: {},
      create: { userId: "demo-user", figurinhaId: fig1.id, quantidade: 2 },
    });
    await prisma.colecao.upsert({
      where: {
        userId_figurinhaId: { userId: "demo-user", figurinhaId: fig3.id },
      },
      update: {},
      create: { userId: "demo-user", figurinhaId: fig3.id, quantidade: 1 },
    });
  }

  console.log("✅ Seed concluído!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
