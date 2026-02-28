import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/onboarding/student",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null;

        const email = String(credentials.email).trim().toLowerCase();
        const otp = String(credentials.otp ?? "").trim();

        // Accept dummy OTP 000000 (created by send-otp API)
        const validOtp = otp === "000000";

        const otpRecord = validOtp
          ? await prisma.oTPToken.findFirst({
              where: {
                email,
                token: "000000",
                used: false,
                expiresAt: { gt: new Date() },
              },
            })
          : null;

        if (!otpRecord) return null;

        await prisma.oTPToken.update({
          where: { id: otpRecord.id },
          data: { used: true },
        });

        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: { email, role: "STUDENT" },
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          image: user.image ?? null,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = String(user.id);
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id as string },
        });
        token.role = dbUser?.role ?? "STUDENT";
        token.name = dbUser?.name ?? null;
        token.image = dbUser?.image ?? null;
      }
      if (trigger === "update" && session?.role) {
        token.role = session.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.name = token.name as string | null;
        session.user.image = token.image as string | null;
      }
      return session;
    },
  },
  trustHost: true,
});
