// File: src/app/api/test/get-progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Handler untuk metode GET
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number((session.user as any).id);

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

    // --- PERBAIKAN DI SINI ---
    const valueMap: { [key: number]: string } = {
      "1": "sangat_setuju",
      "0": "netral",
      "-1": "tidak_setuju",
    };
    // -------------------------

    const progress = savedAnswers.reduce((acc, current) => {
      const answerString = valueMap[current.answerValue];
      if (answerString) {
        acc[current.questionId] = answerString;
      }
      return acc;
    }, {} as { [key: number]: string });

    return NextResponse.json({ answers: progress }, { status: 200 });
  } catch (error) {
    console.error("Error fetching progress:", error);
    return NextResponse.json(
      { message: "Failed to fetch progress" },
      { status: 500 }
    );
  }
}
