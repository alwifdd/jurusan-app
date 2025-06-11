// File: src/components/HeroSection/HeroSection.tsx (DIPERBARUI)

import { HeroAnimations } from "./HeroAnimations";
import prisma from "@/lib/prisma";

// Fungsi untuk mengambil data jumlah pengguna dari database
async function getUserCount() {
  try {
    // Kita gunakan Prisma langsung karena ini Server Component
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    console.error("Gagal fetch user count:", error);
    // Jika gagal, kembalikan angka default agar tidak error
    return 8000;
  }
}

const HeroSection = async () => {
  const userCount = await getUserCount();

  return (
    <div className="container">
      {/* Komponen ini sekarang bersih, tugasnya hanya mengambil data
        dan menyerahkan tampilan serta animasi ke komponen klien.
      */}
      <HeroAnimations userCount={userCount} />
    </div>
  );
};

export default HeroSection;
