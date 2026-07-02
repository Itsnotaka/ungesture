import type { Metadata } from "next";
import Script from "next/script";
import { Bodoni_Moda, Newsreader } from "next/font/google";
import "./globals.css";
import { site } from "./content";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  style: ["normal", "italic"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: site.title,
  description: site.description,
  keywords: [
    "invisible design",
    "interface research",
    "human-computer interaction",
    "AI interfaces",
    "software etiquette",
    "design laboratory",
    "Un Gesture",
  ],
  authors: [{ name: "Un · Gesture Laboratory", url: site.url }],
  alternates: { canonical: site.url },
  openGraph: {
    url: site.url,
    siteName: site.title,
    type: "website",
    locale: "en_US",
    images: [
      {
        url: site.ogImage,
        width: 1200,
        height: 630,
        alt: site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    images: [site.ogImage],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${bodoni.variable} ${newsreader.variable}`}
      suppressHydrationWarning
    >
      <head>
        {process.env.NODE_ENV === "development" && (
          <Script
            src="//unpkg.com/react-grab/dist/index.global.js"
            crossOrigin="anonymous"
            strategy="beforeInteractive"
          />
        )}
      </head>
      <body className="bg-wall text-wall-ink antialiased">{children}</body>
    </html>
  );
}
