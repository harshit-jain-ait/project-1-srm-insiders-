import Link from "next/link";
import { getAllTemplates } from "@/templates/registry";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

export const metadata = {
  title: "Template Gallery | Portfolify",
  description: "Browse verified, responsive portfolio templates designed for modern professionals.",
};

export default function TemplatesPage() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-600/30">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-900/40 backdrop-blur sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Portfolify
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/editor">
              <Button variant="brand" size="sm">
                Open Studio Editor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="max-w-2xl mb-12">
          <Badge variant="blue" className="mb-3">
            Template Architecture
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mb-4">
            Curated Portfolio Templates
          </h1>
          <p className="text-zinc-400 leading-relaxed text-base">
            Every Portfolify template consumes the same canonical data model. Switch between styles at any time without losing your content, projects, or work history.
          </p>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {templates.map((tpl) => (
            <div
              key={tpl.metadata.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/50 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
            >
              {/* Card Header & Preview Banner */}
              <div className="p-6 pb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-400">
                    {tpl.metadata.category}
                  </span>
                  <div className="flex gap-1.5">
                    {tpl.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-zinc-400 bg-zinc-800/80 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-white mb-2">{tpl.metadata.name}</h2>
                <p className="text-sm text-zinc-400 mb-4">{tpl.metadata.description}</p>

                {/* Features List */}
                <div className="space-y-2 pt-4 border-t border-zinc-800/80">
                  <p className="text-xs font-medium text-zinc-300 uppercase tracking-wide">
                    Key Characteristics
                  </p>
                  <ul className="space-y-1.5 text-xs text-zinc-400">
                    {tpl.metadata.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-6 pt-4 border-t border-zinc-800/80 bg-zinc-950/40 flex items-center justify-between">
                <span className="text-xs text-zinc-500 font-mono">
                  ID: {tpl.metadata.id}
                </span>
                <Link href={`/editor?template=${tpl.metadata.id}`}>
                  <Button variant="brand" size="sm" className="gap-1.5">
                    Use This Template <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
