import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The trainer lived under /app until 0.7.0; old links and bookmarks keep working.
  async redirects() {
    return [
      { source: "/app", destination: "/learn", permanent: true },
      { source: "/app/:path*", destination: "/learn/:path*", permanent: true },
      // diesis.es (and www) is the address to share in Spanish: it links in any chat app,
      // where .app often does not. It lands on the Spanish site; deeper paths keep going.
      ...["diesis.es", "www.diesis.es"].flatMap((host) => [
        { source: "/", has: [{ type: "host" as const, value: host }], destination: "https://diesis.app/es", permanent: false },
        { source: "/:path+", has: [{ type: "host" as const, value: host }], destination: "https://diesis.app/:path+", permanent: false },
      ]),
    ];
  },
};

export default nextConfig;
