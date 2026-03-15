import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Exclude the studio route from static page collection
  pageExtensions: ["tsx", "ts", "jsx", "js"],
  excludeDefaultMomentLocales: true,
};

export default nextConfig;
