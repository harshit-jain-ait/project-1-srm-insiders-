"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { UrlImportWizard } from "@/components/url-import/url-import-wizard";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function ImportUrlContent() {
  return (
    <div className="min-h-screen bg-[#0E1015] text-zinc-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="h-14 border-b border-zinc-800 bg-[#0E1015]/90 px-6 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-zinc-400 hover:text-white"
              title="Return to home"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              <span>Back</span>
            </Button>
          </Link>
          <div className="h-4 w-px bg-zinc-800" />
          <span className="text-xs font-semibold text-zinc-200">Website URL Import</span>
        </div>

        <div className="flex items-center gap-4 text-xs text-zinc-400">
          <Link href="/import-resume" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
            Import from Resume
          </Link>
          <Link href="/generate" className="hover:text-white transition-colors">
            AI Guided Notes
          </Link>
          <Link href="/templates" className="hover:text-white transition-colors">
            Browse Templates
          </Link>
          <Link href="/editor" className="hover:text-white transition-colors">
            Blank Studio
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <UrlImportWizard />
      </main>
    </div>
  );
}

export default function ImportUrlPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      }
    >
      <ImportUrlContent />
    </Suspense>
  );
}
