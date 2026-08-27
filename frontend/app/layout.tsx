import "./globals.css";

import type { Metadata, Viewport } from "next";

import { OfflineProvider } from "@/components/OfflineProvider";

export const metadata: Metadata = {
  title: "Lexep — Bridge the gap. Build the future.",
  description:
    "Lexep connects Ghanaian youth with paid internships, practical mentorship, and community-funded grants.",
  generator: "Next.js",
};

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fbf9f8",
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <OfflineProvider />
        {children}
      </body>
    </html>
  );
}