import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The trainer lived under /app until 0.7.0; old links and bookmarks keep working.
  async redirects() {
    return [
      { source: "/app", destination: "/learn", permanent: true },
      { source: "/app/:path*", destination: "/learn/:path*", permanent: true },
      // The speed trainer became the metronome's "Speed up" mode in 0.10.0.
      { source: "/learn/speed-trainer", destination: "/learn/metronome", permanent: true },
      // diesis.es (and www) is the address to share in Spanish: it links in any chat app,
      // where .app often does not. Every path lands on its Spanish twin (every page has one):
      // diesis.es/learn/metronome goes to diesis.app/es/learn/metronome. A path that already
      // starts with /es keeps it rather than doubling it.
      ...["diesis.es", "www.diesis.es"].flatMap((host) => {
        const has = [{ type: "host" as const, value: host }];
        return [
          { source: "/", has, destination: "https://diesis.app/es", permanent: false },
          { source: "/es", has, destination: "https://diesis.app/es", permanent: false },
          { source: "/es/:path*", has, destination: "https://diesis.app/es/:path*", permanent: false },
          { source: "/:path+", has, destination: "https://diesis.app/es/:path+", permanent: false },
        ];
      }),
    ];
  },
};

export default nextConfig;
