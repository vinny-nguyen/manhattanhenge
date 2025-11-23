// Next.js Imports & Constants:
import type { Metadata } from "next";
import { EB_Garamond, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Manhattanhenge",
  description: "Manhattanhenge Azimuth Sunset Street Map",
};

// Imports:
import { Playfair_Display } from "next/font/google";
import "mapbox-gl/dist/mapbox-gl.css";

// Constants:
const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["700"],
});

const playfair_light = Playfair_Display({
  variable: "--font-playfair_light",
  subsets: ["latin"],
  weight: ["500"],
});

const ebgaramond = EB_Garamond({
  variable: "--font-ebgaramond",
  subsets: ["latin"],
  weight: ["400"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} ${ebgaramond.variable}`}>
        {children}
      </body>
    </html>
  );
}
