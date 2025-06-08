// File: src/app/api/test/questions/route.ts
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

    // Acak urutan pertanyaan sebelum dikirim ke frontend
    const shuffledQuestions = allQuestions.sort(() => Math.random() - 0.5);

    return NextResponse.json({ questions: shuffledQuestions });
  } catch (error) {
    console.error("Gagal mengambil pertanyaan dari DB:", error);
    return NextResponse.json(
      { message: "Gagal memuat pertanyaan." },
      { status: 500 }
    );
  }
}
