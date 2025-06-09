// File: src/types/next-auth.d.ts (VERSI PERBAIKAN FINAL)
import "next-auth";
import "next-auth/jwt"; // Impor ini penting

declare module "next-auth" {
  // Perluas tipe User
  interface User {
    id: string;
  }
  // Perluas tipe Session
  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  // Perluas tipe JWT
  interface JWT {
    id: string;
  }
}
