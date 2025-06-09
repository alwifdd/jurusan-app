// File: src/app/api/test/clear-progress/route.ts (SUDAH DIPERBAIKI)

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function POST() {
  const session = await getServerSession(authOptions);

  // Pengecekan sesi sekarang juga memeriksa keberadaan 'user.id'
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Menghapus '(as any)' karena tipe sesi sudah benar
    const userId = Number(session.user.id);

    await prisma.userAnswer.deleteMany({
      where: { userId: userId },
    });

    return NextResponse.json({ message: "Progress cleared" }, { status: 200 });
  } catch (_error) {
    // 2. Menggunakan '_' untuk variabel yang tidak dipakai
    // 'error' diganti menjadi '_error'
    return NextResponse.json(
      { message: "Failed to clear progress" },
      { status: 500 }
    );
  }
}
