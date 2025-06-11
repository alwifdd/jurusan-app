// src/app/layout.tsx (DENGAN PERBAIKAN PWA)
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import AuthSessionProvider from "@/components/AuthSessionProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "JurusanKu - Temukan Jurusanmu",
  description: "Tes minat bakat untuk menemukan jurusan yang paling cocok.",
  // Tambahan metadata untuk PWA
  manifest: "/manifest.json",
  icons: {
    apple: "/icons/icon-192x192.png", // Atau ukuran lain yang sesuai
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* ======================================================== */}
        {/* ===== TAMBAHAN PENTING UNTUK PWA & TAMPILAN MOBILE ===== */}
        {/* ======================================================== */}
        <meta name="application-name" content="JurusanKu" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="JurusanKu" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#FFFFFF" />
      </head>
      <body className={poppins.className}>
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
