import type { Metadata } from "next";
import { Hanken_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { OfflineProvider } from "@/components/OfflineProvider";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  weight: ["500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Lexep — Empowering African Youth",
  description:
    "Lexep connects African youth with mentors, internships, and community-funded grants.",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hanken.variable} ${inter.variable}`}>
      <body>
        <OfflineProvider />
        {children}
      </body>
    </html>
  );
}
