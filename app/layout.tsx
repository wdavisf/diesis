import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import { Consent } from "@/components/consent";
import { strings } from "@/lib/i18n";
import { CARD_VERSION } from "@/lib/lang";
import "./globals.css";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
});

// The landing's own words, in English: the fallback for any page without its own.
const { title: ogTitle, description } = strings.en.meta;

export const metadata: Metadata = {
  title: { default: "Diesis", template: "%s · Diesis" },
  description,
  metadataBase: new URL("https://diesis.app"),
  icons: { icon: "/favicon.svg", apple: "/icon.png" },
  openGraph: {
    title: ogTitle,
    description,
    siteName: "Diesis",
    images: [{ url: `/og.png?v=${CARD_VERSION}`, width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

const SIDEBAR_SCRIPT = `try{if(localStorage.getItem("diesis_sidebar")==="collapsed")document.documentElement.dataset.sidebar="collapsed"}catch(e){}`;

export const viewport: Viewport = { themeColor: "#14120f" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${display.variable} h-full`} suppressHydrationWarning>
      <body className="flex min-h-full flex-col">
        {/* The app's sidebar, collapsed or not (components/app-nav.tsx): set on <html> before the
            first paint, so a collapsed sidebar does not open and shut on every load. */}
        <script dangerouslySetInnerHTML={{ __html: SIDEBAR_SCRIPT }} />
        {children}
        <Consent />
      </body>
    </html>
  );
}
