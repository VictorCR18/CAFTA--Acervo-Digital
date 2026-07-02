/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-4ad2e8806dd548dfb67193d7f9b3b100.r2.dev",
      },
    ],
  }
};

export default nextConfig;