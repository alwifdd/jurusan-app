// next.config.ts (VERSI FINAL & PALING AMAN)

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https" as const,
        hostname: "placehold.co",
      },
      {
        protocol: "https" as const,
        hostname: "i.pravatar.cc",
      },
      {
        protocol: "https" as const,
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Biarkan ini aktif untuk sementara
  },
};

module.exports = withPWA(nextConfig);
