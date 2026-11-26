import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Optimised images stay cached on Vercel's edge for 31 days instead of a
    // few hours, so visitors rarely wait for an image to be re-processed.
    minimumCacheTTL: 2678400,
    // Skip the 3840px variant: heavier than any screen here needs and slow to
    // generate the first time.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
};

export default nextConfig;
