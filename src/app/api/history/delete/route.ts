// src/app/api/history/delete/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { resultId } = await request.json();
    const userId = Number(session.user.id);

    // Hapus hanya jika hasil tes adalah milik user yang sedang login
    await prisma.quizResult.deleteMany({
      where: {
        id: Number(resultId),
        userId: userId,
      },
    });
    return NextResponse.json({ message: "Riwayat berhasil dihapus" });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menghapus riwayat" },
      { status: 500 }
    );
  }
}
