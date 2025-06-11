// src/app/page.tsx (DENGAN PERBAIKAN CACHE)

import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/HeroSection/HeroSection";
import FeatureSection from "@/components/FeatureSection/FeatureSection";
import GrowSection from "@/components/GrowSection/GrowSection";
import HowItWorksSection from "@/components/HowItWorksSection/HowItWorksSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import TeamSection from "@/components/TeamSection/TeamSection";
import FooterSection from "@/components/FooterSection/FooterSection";

// ========================================================
// ===== TAMBAHKAN BARIS INI UNTUK MEMATIKAN CACHING =====
// ========================================================
export const revalidate = 0;

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeatureSection />
        <GrowSection />
        <HowItWorksSection />
        <AboutSection />
        <TeamSection />
      </main>
      <FooterSection />
    </>
  );
}
