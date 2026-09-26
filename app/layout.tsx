import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Consent } from "@/components/consent";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

const description =
  "Everything you need to master the guitar, in one place. See every note and scale on the neck, learn the notes and build speed with the metronome today; scale exercises, reading music and tools for your own guitar come next. Free, in the browser.";

export const metadata: Metadata = {
  title: { default: "Diesis", template: "%s · Diesis" },
  description,
  metadataBase: new URL("https://diesis.app"),
  icons: { icon: "/favicon.svg", apple: "/icon.png" },
  openGraph: {
    title: "Diesis — everything you need to master the guitar",
    description,
    siteName: "Diesis",
    images: [{ url: "/og.png?v=4", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#14120f" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        {children}
        <Consent />
      </body>
    </html>
  );
}
