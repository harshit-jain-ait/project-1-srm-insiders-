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
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          id="theme-script"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('portfolify_theme'),p=window.matchMedia('(prefers-color-scheme:dark)').matches,d=s==='dark'||(!s&&p)||!s,r=document.documentElement;if(d){r.classList.add('dark');r.classList.remove('light');r.setAttribute('data-theme','dark');r.style.colorScheme='dark';}else{r.classList.remove('dark');r.classList.add('light');r.setAttribute('data-theme','light');r.style.colorScheme='light';}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#09090b] text-slate-900 dark:text-[#fafafa] font-sans selection:bg-blue-600/30 selection:text-white transition-colors duration-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
