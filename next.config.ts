import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The trainer lived under /app until 0.7.0; old links and bookmarks keep working.
  async redirects() {
    return [
      { source: "/app", destination: "/learn", permanent: true },
      { source: "/app/:path*", destination: "/learn/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
