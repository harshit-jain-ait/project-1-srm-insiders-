"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AiGeneratorWizard } from "@/components/ai/ai-generator-wizard";
import { TemplateId } from "@/lib/schema/portfolio";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

function GeneratePageContent() {
  const searchParams = useSearchParams();
  const templateParam = searchParams.get("template") as TemplateId | null;

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
          <span className="text-xs font-semibold text-zinc-200">AI Guided Setup</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <Link href="/templates" className="hover:text-white transition-colors">
            Browse Templates
          </Link>
          <Link href="/editor" className="hover:text-white transition-colors">
            Blank Studio
          </Link>
        </div>
      </header>

      {/* Main Guided Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <AiGeneratorWizard initialTemplate={templateParam || "minimal-portfolio"} />
      </main>
    </div>
  );
}

export default function GeneratePage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex items-center justify-center bg-zinc-950 text-zinc-400">
          <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
        </div>
      }
    >
      <GeneratePageContent />
    </Suspense>
  );
}
