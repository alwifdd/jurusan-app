// src/app/profile/page.tsx (BENAR)

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ProfileClient from "./ProfileClient"; // Impor komponen klien baru

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // Ambil data pengguna dan riwayat tesnya dari database
  const userWithHistory = await prisma.user.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      quizResults: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!userWithHistory) {
    return <div>Pengguna tidak ditemukan.</div>;
  }

  // Kirim data ke komponen klien untuk ditampilkan
  return <ProfileClient user={userWithHistory} />;
}
