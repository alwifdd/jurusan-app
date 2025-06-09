// File: src/app/api/test/get-progress/route.ts (SUDAH DIPERBAIKI)
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// Handler untuk metode GET
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Menghapus '(as any)' karena tipe sesi sudah benar
    const userId = Number(session.user.id);

    const savedAnswers = await prisma.userAnswer.findMany({
      where: {
        userId: userId,
      },
      select: {
        questionId: true,
        answerValue: true,
      },
    });

    if (savedAnswers.length === 0) {
      return NextResponse.json({ answers: {} }, { status: 200 });
    }

    const valueMap: { [key: number]: string } = {
      "1": "sangat_setuju",
      "0": "netral",
      "-1": "tidak_setuju",
    };

    const progress = savedAnswers.reduce((acc, current) => {
      const answerString = valueMap[current.answerValue];
      if (answerString) {
        acc[current.questionId] = answerString;
      }
      return acc;
    }, {} as { [key: number]: string });

    return NextResponse.json({ answers: progress }, { status: 200 });
  } catch (_error) {
    // 2. Menggunakan '_' untuk variabel yang tidak dipakai
    console.error("Error fetching progress:", _error);
    return NextResponse.json(
      { message: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
