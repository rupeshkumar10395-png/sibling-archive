import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow dev assets from local network IP (Docker or remote dev environment)
  allowedDevOrigins: ["172.21.56.39"],
};

export default nextConfig;
