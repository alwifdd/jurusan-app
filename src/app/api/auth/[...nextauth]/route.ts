// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Profile, Account, User } from "next-auth";
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
      if (account?.provider === "google" && profile?.email) {
        try {
          const userFromDb = await prisma.user.findUnique({
            where: { email: profile.email },
          });

          if (userFromDb) {
            // Jika user ada, update data jika perlu (misal gambar profil berubah)
            await prisma.user.update({
              where: { email: profile.email },
              data: {
                name: profile.name,
                image: (profile as any).picture,
                provider: "google",
                provider_id: user.id,
              },
            });
          } else {
            // Jika user belum ada, buat user baru
            await prisma.user.create({
              data: {
                email: profile.email,
                name: profile.name,
                image: (profile as any).picture,
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
      if (user) {
        // Saat login, user object dari authorize atau signIn callback tersedia.
        // Langsung teruskan informasinya ke token.
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        (session.user as any).id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture as string | null | undefined;
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

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
