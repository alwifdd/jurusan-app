// src/app/api/profile/update-name/route.ts
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
    const { newName } = await request.json();
    if (!newName || typeof newName !== "string") {
      return NextResponse.json(
        { message: "Nama tidak valid" },
        { status: 400 }
      );
    }
    await prisma.user.update({
      where: { id: Number(session.user.id) },
      data: { name: newName },
    });
    return NextResponse.json({ message: "Nama berhasil diperbarui" });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal memperbarui nama" },
      { status: 500 }
    );
  }
}
