import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      try {
        const jaTemPacotes = await prisma.pacote.findFirst({
          where: { userId: user.email },
        });

        if (!jaTemPacotes) {
          console.log(`🎁 Criando 5 pacotes iniciais para: ${user.email}`);
          await prisma.pacote.createMany({
            data: [
              { userId: user.email, aberto: false },
              { userId: user.email, aberto: false },
              { userId: user.email, aberto: false },
              { userId: user.email, aberto: false },
              { userId: user.email, aberto: false },
            ],
          });
        }

        return true;
      } catch (error) {
        console.error("🚨 Erro ao gerar pacotes iniciais no login:", error);
        return false;
      }
    },
  },
};