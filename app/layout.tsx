import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const description =
  "A spot lights up on the guitar neck and you hear it. Name it. Diesis teaches the fretboard, then scales, then reading music, as games you play with the guitar on your lap.";

export const metadata: Metadata = {
  title: { default: "Diesis", template: "%s · Diesis" },
  description,
  metadataBase: new URL("https://diesis.app"),
  icons: { icon: "/favicon.svg", apple: "/icon.png" },
  openGraph: {
    title: "Diesis — know every note on the guitar neck",
    description,
    siteName: "Diesis",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#14120f" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
