// @ts-ignore — Next.js processes this global stylesheet at build time.
import "./globals.css";
import { OfflineProvider } from "@/components/OfflineProvider";
import type { Metadata, Viewport } from "next";

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

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="bg-[#fbf9f8]">
      <body className="antialiased">
        <OfflineProvider />
        {children}
      </body>
    </html>
  );
}
