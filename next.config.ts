import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true }, // <— temporary
  trailingSlash: true,
};

export default nextConfig;
