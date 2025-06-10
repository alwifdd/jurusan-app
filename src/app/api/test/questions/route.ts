// File: src/app/api/test/questions/route.ts (FINAL TANPA ACAK)
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil semua pertanyaan dari database
    const allQuestions = await prisma.question.findMany({
      // Urutkan berdasarkan ID agar konsisten
      orderBy: {
        id: "asc",
      },
    });

    // HAPUS BARIS YANG MENGACAK PERTANYAAN
    // const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

    // Kirim pertanyaan yang sudah terurut, bukan yang diacak
    return NextResponse.json({ questions: allQuestions });
  } catch (error) {
    console.error("Gagal mengambil pertanyaan dari DB:", error);
    return NextResponse.json(
      { message: "Gagal memuat pertanyaan." },
      { status: 500 }
    );
  }
}
