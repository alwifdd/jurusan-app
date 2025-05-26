import Navbar from "@/components/Navbar/Navbar";
import HeroSection from "@/components/HeroSection/HeroSection";
import FeatureSection from "@/components/FeatureSection/FeatureSection";
import GrowSection from "@/components/GrowSection/GrowSection";
import HowItWorksSection from "@/components/HowItWorksSection/HowItWorksSection";
import AboutSection from "@/components/AboutSection/AboutSection";
import TeamSection from "@/components/TeamSection/TeamSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <HeroSection />

      <main>
        <FeatureSection />
        <GrowSection />
        <HowItWorksSection />
        <AboutSection />
        <TeamSection />
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "60px 20px",
          color: "#888",
          background: "#fff",
        }}
      >
        <p>&copy; {new Date().getFullYear()} JurusanKu. All rights reserved.</p>
      </footer>
    </>
  );
}
