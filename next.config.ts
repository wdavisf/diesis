import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // app/global-not-found.tsx: with two root layouts (app/(en), app/(es)) there is no single layout
  // to draw the 404 page in, so it brings its own document.
  experimental: { globalNotFound: true },
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
        // 0.35.0 split Learn into tracks, each with its own page: /learn opens the first. Inside the
        // app, links to Learn go to the track opened last (lib/game/use-learn-track.ts).
        { source: `${es}/learn`, destination: `${es}/learn/notes`, permanent: false },
      ]),
      // The tools' public pages have a translated slug (`features.pages` in lib/i18n.ts, mirrored
      // here because this file cannot import it): the English slug under /es, and the Spanish one
      // without /es, go to the Spanish page.
      ...[
        ["name-the-note", "nombra-la-nota"],
        ["find-the-note", "encuentra-la-nota"],
        ["fretboard", "mastil"],
        ["metronome", "metronomo"],
        ["finger-independence", "independencia-de-dedos"],
        ["strings", "cuerdas"],
        ["guitar-tuner", "afinador"],
      ].flatMap(([en, es]) => [
        { source: `/es/${en}`, destination: `/es/${es}`, permanent: true },
        { source: `/${es}`, destination: `/es/${es}`, permanent: true },
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
