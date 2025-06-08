// File: src/app/api/test/clear-progress/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = Number((session.user as any).id);
    await prisma.userAnswer.deleteMany({
      where: { userId: userId },
    });
    return NextResponse.json({ message: "Progress cleared" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Failed to clear progress" },
      { status: 500 }
    );
  }
}
