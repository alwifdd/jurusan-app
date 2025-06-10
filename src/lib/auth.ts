// File: src/lib/auth.ts (FINAL DENGAN PERBAIKAN JWT)

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Kredensial tidak valid.");
        }
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.password_hash) {
          throw new Error("Email atau password salah.");
        }
        const isPasswordMatch = await bcrypt.compare(
          credentials.password,
          user.password_hash
        );
        if (!isPasswordMatch) {
          throw new Error("Email atau password salah.");
        }
        return {
          id: user.id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!profile?.email) {
          throw new Error("Tidak ada profil email dari provider.");
        }
        try {
          const userFromDb = await prisma.user.findUnique({
            where: { email: profile.email },
          });
          const googleProfile = profile as { picture?: string };
          if (userFromDb) {
            await prisma.user.update({
              where: { email: profile.email },
              data: { name: profile.name, image: googleProfile.picture },
            });
          } else {
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                image: googleProfile.picture,
                provider: "google",
                provider_id: user.id,
              },
            });
          }
          return true;
        } catch (error) {
          console.error("Error during Google sign-in DB upsert:", error);
          return false;
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // Jika 'user' ada (saat login), cari data lengkapnya di database
      if (user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // Jika ditemukan, perbarui token dengan ID dari database
        if (dbUser) {
          token.id = dbUser.id.toString();
          token.name = dbUser.name;
          token.picture = dbUser.image;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Ambil data dari token yang sudah diperbarui
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
