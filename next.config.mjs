/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dist directory can be overridden at runtime (used by dev script to avoid OneDrive locks).
  distDir: process.env.NEXT_DIST_DIR || ".next-local",
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
