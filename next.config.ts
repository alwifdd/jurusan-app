import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co", // Ini sudah ada sebelumnya
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc", // Ini juga sudah ada sebelumnya
      },
      {
        // <-- TAMBAHKAN BLOK INI UNTUK GOOGLE USER CONTENT -->
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
