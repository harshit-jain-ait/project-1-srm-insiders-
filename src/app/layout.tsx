import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolify — AI-Assisted Portfolio Website Builder",
  description:
    "Build, customize, and publish professional portfolio websites with live editing, grounded AI assistance, and responsive templates.",
  keywords: [
    "portfolio builder",
    "developer portfolio",
    "engineer website",
    "AI portfolio generator",
    "case studies",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full dark antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#09090b] text-[#fafafa] font-sans selection:bg-blue-600/30 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
