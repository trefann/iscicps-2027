import type { Metadata } from "next";
import { Bodoni_Moda, Geist_Mono, Manrope } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const bodoni = Bodoni_Moda({
  variable: "--font-display",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "iscicps.in";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.includes("localhost") ? "http" : "https");
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: {
      default: "ISCICPS '27",
      template: "%s — ISCICPS '27",
    },
    description:
      "International Symposium on Computational Intelligence for Cyber-Physical Systems, hosted by SRMIST.",
    openGraph: {
      title: "ISCICPS '27",
      description: "Intelligence meets the physical world. 21–22 April 2027.",
      type: "website",
      images: [{ url: `${origin}/og.png`, width: 1792, height: 938, alt: "ISCICPS '27 — Intelligence meets the physical world" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "ISCICPS '27",
      description: "Intelligence meets the physical world. 21–22 April 2027.",
      images: [`${origin}/og.png`],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${bodoni.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
