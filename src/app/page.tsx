import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllTemplates } from "@/templates/registry";
import {
  ArrowRight,
  Sparkles,
  Layout,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Code2,
} from "lucide-react";

export default function HomePage() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen flex flex-col bg-[#09090b] text-[#fafafa] selection:bg-blue-600/30 selection:text-white">
      {/* Navigation Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/70 backdrop-blur sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded bg-blue-600 flex items-center justify-center text-white font-mono text-sm font-bold">
              P
            </div>
            <span className="font-semibold text-base tracking-tight text-white">
              Portfolify
            </span>
          </div>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/templates"
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              Templates
            </Link>
            <Link href="/editor">
              <Button variant="brand" size="sm" className="gap-1.5 shadow-sm">
                Open Studio <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-20 md:pt-28 md:pb-28 border-b border-zinc-850">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-300">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Grounded AI & Canonical Schema Architecture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white max-w-3xl mx-auto leading-[1.12]">
            Build an executive portfolio without writing boilerplate.
          </h1>

          <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
            Transform your engineering history, projects, and skills into a responsive, published portfolio website with live visual editing and verified data integrity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button variant="brand" size="lg" className="w-full sm:w-auto gap-2">
                Create Your Portfolio <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Templates
              </Button>
            </Link>
          </div>

          {/* Core Guarantees */}
          <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left text-xs text-zinc-400">
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-850">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Zero Hallucinated Data:</strong> AI strictly structures facts you provide.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-850">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Canonical Architecture:</strong> Switch templates seamlessly without losing content.</span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-zinc-900/40 border border-zinc-850">
              <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <span><strong>Live Publishing:</strong> Instant custom slugs with server-side validation.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Capabilities Grid */}
      <section className="py-20 border-b border-zinc-850 bg-zinc-950/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <Badge variant="blue" className="mb-3">
              Engineered Capabilities
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Built for speed, accuracy, and editorial polish.
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Every component adheres to a strict design system with restrained blue accents, crisp contrast, and genuine persistence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-blue-950/60 border border-blue-800/80 flex items-center justify-center text-blue-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Grounded AI Assistant</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Provide raw notes or career bullet points. Portfolify structures them into verified schema fields with an interactive diff review before application.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Live Split Studio</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Edit profile, case studies, experience, and skills in the sidebar while viewing instant desktop, tablet, and mobile previews in real time.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/40 space-y-3">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <Layout className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold text-white">Modular Template Registry</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Independent, responsive templates consuming a shared canonical model. Switch between Editorial and Engineering layouts at will.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-20 border-b border-zinc-850">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <Badge variant="blue" className="mb-3">
                Template Gallery
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
                Available Portfolio Templates
              </h2>
              <p className="text-zinc-400 text-sm">
                Each template is completely responsive, accessible, and handles empty states gracefully.
              </p>
            </div>
            <Link href="/templates">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                View All Details <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((tpl) => (
              <div
                key={tpl.metadata.id}
                className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden flex flex-col justify-between"
              >
                <div className="p-6 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-mono uppercase">{tpl.metadata.category}</span>
                    <span className="font-mono text-zinc-500">ID: {tpl.metadata.id}</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{tpl.metadata.name}</h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {tpl.metadata.description}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {tpl.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-zinc-400 bg-zinc-850 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/60 border-t border-zinc-850 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">Zero data required to preview</span>
                  <Link href={`/editor?template=${tpl.metadata.id}`}>
                    <Button variant="brand" size="sm" className="text-xs">
                      Build With This Template
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-10 border-t border-zinc-850 bg-zinc-950 text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-zinc-300">Portfolify</span>
            <span>—</span>
            <span>Production-Ready Portfolio Engine</span>
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Link href="/templates" className="hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/editor" className="hover:text-white transition-colors">
              Studio
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
