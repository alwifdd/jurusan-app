// File: src/app/api/test/save-progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { questionId, answerValue: answerString } = await request.json(); // Ambil jawaban sebagai string
    const userId = Number((session.user as any).id);

    // --- BAGIAN YANG DIEDIT DIMULAI DI SINI ---

    // 1. Buat pemetaan dari string ke angka
    const answerMap: { [key: string]: number } = {
      sangat_setuju: 1,
      netral: 0,
      tidak_setuju: -1,
    };

    // 2. Konversi jawaban string ke angka
    const numericAnswer = answerMap[answerString];

    // 3. Validasi jika jawaban yang dikirim tidak valid
    if (numericAnswer === undefined) {
      return NextResponse.json(
        { message: "Invalid answer value provided." },
        { status: 400 }
      );
    }

    // --- BAGIAN YANG DIEDIT SELESAI ---

    // Gunakan `upsert` dengan nilai angka yang sudah dikonversi
    await prisma.userAnswer.upsert({
      where: {
        userId_questionId: {
          // Ini berdasarkan unique index di skema Anda
          userId: userId,
          questionId: questionId,
        },
      },
      update: {
        answerValue: numericAnswer, // Simpan angka
      },
      create: {
        userId: userId,
        questionId: questionId,
        answerValue: numericAnswer, // Simpan angka
      },
    });

    return NextResponse.json({ message: "Progress saved" }, { status: 200 });
  } catch (error) {
    console.error("Error saving progress:", error);
    return NextResponse.json(
      { message: "Failed to save progress" },
      { status: 500 }
    );
  }
}
