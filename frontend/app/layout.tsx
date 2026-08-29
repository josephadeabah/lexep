import "./globals.css";

import type { Metadata, Viewport } from "next";
import { OfflineProvider } from "@/components/OfflineProvider";
import { Hanken_Grotesk, Inter } from "next/font/google";

const hanken = Hanken_Grotesk({ subsets: ["latin"], variable: "--font-hanken" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Lexep — Build the career you’re meant to lead",
  description: "Career development with direction for ambitious professionals.",
  generator: "Lexep",
  icons: {
    icon: [
      {
        url: "/brand/lexep-mark-gold.png",
        type: "image/png",
      },
    ],
    apple: "/brand/lexep-mark-gold.png",
  },
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fbf9f8",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-[#fbf9f8]">
      <body className={`${hanken.variable} ${inter.variable} font-sans antialiased`}>
        <OfflineProvider />
        {children}
      </body>
    </html>
  );
}
