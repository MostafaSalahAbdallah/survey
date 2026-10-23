import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_SKIP_TIMER:
      process.env.NEXT_PUBLIC_SKIP_TIMER ??
      process.env.SKIP_TIMER ??
      process.env.NEXT_PUBLIC_DISABLE_TIMER ??
      process.env.DISABLE_TIMER ??
      '',
    NEXT_PUBLIC_SKIP_REQUIRED:
      process.env.NEXT_PUBLIC_SKIP_REQUIRED ??
      process.env.SKIP_REQUIRED ??
      process.env.NEXT_PUBLIC_SKIP_REQUIRED_FIELDS ??
      process.env.SKIP_REQUIRED_FIELDS ??
      process.env.NEXT_PUBLIC_DISABLE_REQUIRED ??
      process.env.DISABLE_REQUIRED ??
      '',
  },
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
