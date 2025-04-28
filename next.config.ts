// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Opt out these from the RSC/Edge bundling so they're required natively:
  serverExternalPackages: ["utf-8-validate", "bufferutil", "canvas"], // :contentReference[oaicite:0]{index=0} :contentReference[oaicite:1]{index=1}

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
