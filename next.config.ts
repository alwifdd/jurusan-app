import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ganti komentar '/* config options here */' dengan kode di bawah ini:
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
