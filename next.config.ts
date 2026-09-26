import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The trainer lived under /app until 0.7.0 (its menu is /start now); old links and bookmarks keep working.
  async redirects() {
    return [
      { source: "/app", destination: "/start", permanent: true },
      { source: "/app/:path*", destination: "/learn/:path*", permanent: true },
      // 0.14.0 split the app into Learn and Practice: the tools moved to /practice and the
      // profile to /profile. The speed trainer became the metronome's "Speed up" mode in 0.10.0.
      // Redirects run before proxy.ts, so the /es addresses need their own.
      ...(["", "/es"] as const).flatMap((es) => [
        { source: `${es}/learn/speed-trainer`, destination: `${es}/practice/metronome`, permanent: true },
        { source: `${es}/learn/metronome`, destination: `${es}/practice/metronome`, permanent: true },
        { source: `${es}/learn/neck`, destination: `${es}/practice/neck`, permanent: true },
        { source: `${es}/learn/profile`, destination: `${es}/profile`, permanent: true },
        // Strings and setup opened in Practice (0.17.0) and moved to its own side, Setup, in 0.18.0.
        { source: `${es}/practice/strings`, destination: `${es}/setup/strings`, permanent: true },
      ]),
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
