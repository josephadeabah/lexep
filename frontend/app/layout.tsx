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
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
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
