// src/app/page.tsx
import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/HeroSection/HeroSection";
import FeatureSection from "@/components/FeatureSection/FeatureSection";
import GrowSection from "@/components/GrowSection/GrowSection";
import HowItWorksSection from "@/components/HowItWorksSection/HowItWorksSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import TeamSection from "@/components/TeamSection/TeamSection";
import FooterSection from "@/components/FooterSection/FooterSection";

export default function Home() {
  return (
    // Struktur lebih sederhana, hanya menyusun komponen Anda
    // Tidak perlu div pembungkus dengan style dari page.module.css
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
