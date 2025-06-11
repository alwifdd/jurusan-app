// src/components/HeroSection/HeroSection.tsx (FINAL DENGAN DIRECT DB CALL)

import prisma from "@/lib/prisma"; // Impor prisma langsung
import { HeroAnimations } from "./HeroAnimations";

// Fungsi untuk mengambil data jumlah pengguna LANGSUNG DARI DATABASE
async function getUserCount() {
  try {
    // Tidak perlu fetch, panggil prisma langsung!
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    console.error("Gagal mengambil jumlah pengguna dari DB:", error);
    return 8000; // Angka fallback jika database error
  }
}

// HeroSection sekarang menjadi Server Component murni
const HeroSection = async () => {
  const userCount = await getUserCount();

  return (
    <div className="container">
      {/* Kirim data ke komponen animasi seperti biasa */}
      <HeroAnimations userCount={userCount} />
    </div>
  );
};

export default HeroSection;
