// File: src/app/(main)/layout.tsx
import Navbar from "@/components/Navbar/Navbar";
import FooterSection from "@/components/FooterSection/FooterSection";
import React from "react";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <FooterSection />
    </>
  );
}
