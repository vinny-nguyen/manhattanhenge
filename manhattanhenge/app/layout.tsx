// Next.js Imports & Constants:
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
import dynamic from "next/dynamic";

// Constants:
const ManhattanhengeMap = dynamic(() => Promise.resolve(function MapPage() { return <div style={{display: "none"}}/> }));

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ManhattanhengeMap/>
      </body>
    </html>
  );
}
