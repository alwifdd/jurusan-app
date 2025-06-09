// File: src/types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Modifikasi tipe JWT
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string; // Menambahkan id ke token
  }
}

// Modifikasi tipe Session
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Menambahkan id ke sesi pengguna
    } & DefaultSession["user"];
  }

  // Modifikasi tipe User
  interface User extends DefaultUser {
    id: string;
  }
}
