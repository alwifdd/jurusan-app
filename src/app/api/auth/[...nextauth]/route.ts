// File: src/app/api/auth/[...nextauth]/route.ts (VERSI BARU)
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // <-- IMPOR DARI LOKASI BARU

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
