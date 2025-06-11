// src/app/api/users/count/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Pastikan data selalu baru

export async function GET() {
  try {
    // Gunakan Prisma untuk menghitung semua entri di tabel User
    const userCount = await prisma.user.count();

    // Kirim kembali jumlahnya dalam format JSON
    return NextResponse.json({ count: userCount });
  } catch (error) {
    console.error("Gagal menghitung pengguna:", error);
    return NextResponse.json(
      { message: "Gagal mengambil data." },
      { status: 500 }
    );
  }
}
