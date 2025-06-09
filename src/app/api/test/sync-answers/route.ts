// File: src/app/api/test/sync-answers/route.ts
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
    // Menerima satu objek besar berisi semua jawaban dari localStorage
    const { answers: answersFromLocal } = await request.json();
    const userId = Number((session.user as any).id);

    // Pemetaan dari string ke angka
    const answerMap: { [key: string]: number } = {
      sangat_setuju: 1,
      netral: 0,
      tidak_setuju: -1,
    };

    // Siapkan semua operasi upsert dalam sebuah array
    const upsertOperations = Object.entries(answersFromLocal)
      .map(([questionId, answerString]) => {
        const numericAnswer = answerMap[answerString as string];

        // Pastikan jawaban valid sebelum membuat operasi
        if (numericAnswer !== undefined) {
          return prisma.userAnswer.upsert({
            where: {
              userId_questionId: {
                userId: userId,
                questionId: Number(questionId),
              },
            },
            update: { answerValue: numericAnswer },
            create: {
              userId: userId,
              questionId: Number(questionId),
              answerValue: numericAnswer,
            },
          });
        }
        return null; // Abaikan jika jawaban tidak valid
      })
      .filter((op) => op !== null); // Hapus semua operasi yang null

    // Jalankan semua operasi upsert secara bersamaan
    if (upsertOperations.length > 0) {
      await prisma.$transaction(upsertOperations as any);
    }

    return NextResponse.json(
      { message: "Progress synced successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing progress:", error);
    return NextResponse.json(
      { message: "Failed to sync progress" },
      { status: 500 }
    );
  }
}
