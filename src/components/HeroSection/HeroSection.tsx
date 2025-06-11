// src/components/HeroSection/HeroSection.tsx
import prisma from "@/lib/prisma";
import { HeroAnimations } from "./HeroAnimations";

async function getUserCount() {
  try {
    const count = await prisma.user.count();
    return count;
  } catch (error) {
    console.error("Gagal fetch user count:", error);
    return 8000;
  }
}

const HeroSection = async () => {
  const userCount = await getUserCount();
  return (
    <div className="container">
      <HeroAnimations userCount={userCount} />
    </div>
  );
};

export default HeroSection;
