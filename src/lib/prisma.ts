// src/lib/prisma.ts (Versi Perbaikan)
import { PrismaClient } from "@prisma/client";

// 1. Buat variabel untuk global object yang type-safe
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

// 2. Gunakan '??' (Nullish Coalescing) untuk memeriksa apakah instance sudah ada
const prisma = globalForPrisma.prisma ?? new PrismaClient();

// 3. Simpan instance ke global object hanya jika tidak dalam mode produksi
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
