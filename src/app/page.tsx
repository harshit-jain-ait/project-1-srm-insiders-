import React from "react";
import Link from "next/link";
import { LandingNavbar } from "@/components/landing/navbar";
import { HeroVisual } from "@/components/landing/hero-visual";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getAllTemplates } from "@/templates/registry";
import {
  DisplayHeading,
  PageHeading,
  SectionHeading,
  Text,
  Caption,
} from "@/components/ui/typography";
import {
  ArrowRight,
  Sparkles,
  Layout,
  Eye,
  ShieldCheck,
  CheckCircle2,
  Globe,
  Sliders,
  Check,
} from "lucide-react";

export const metadata = {
  title: "Portfolify — Build a Portfolio That Speaks for You",
  description:
    "Create a professional portfolio that showcases your skills, projects, and career story—with flexible templates, live editing, and grounded AI assistance.",
};

export default function HomePage() {
  const templates = getAllTemplates();

  return (
    <div className="min-h-screen flex flex-col bg-[#101114] text-[#F7F7F5] selection:bg-blue-600/30 selection:text-white font-sans">
      {/* 1. Navigation Bar */}
      <LandingNavbar />

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[#303238]">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#191B20] border border-[#303238] text-xs text-zinc-300">
            <Caption className="text-[#356ae6] font-semibold">
              YOUR WORK, BEAUTIFULLY PRESENTED
            </Caption>
          </div>

          <DisplayHeading className="max-w-4xl mx-auto">
            Build a portfolio that speaks for you.
          </DisplayHeading>

          <Text className="text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg font-light leading-relaxed">
            Create a professional portfolio that showcases your skills, projects, and story—with flexible templates and tools designed to make the process easier.
          </Text>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button variant="brand" size="lg" className="w-full sm:w-auto gap-2 shadow-sm font-semibold">
                <span>Build your portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-zinc-700 hover:bg-zinc-900 text-zinc-200">
                Explore templates
              </Button>
            </Link>
          </div>

          {/* Interactive Hero Visual Composition */}
          <div className="pt-10">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* 3. Product Benefits Section */}
      <section id="features" className="py-20 md:py-28 border-b border-[#303238] bg-[#141519]/50">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="max-w-2xl space-y-3">
            <Badge variant="blue">Product Capabilities</Badge>
            <PageHeading>Engineered for clarity, speed, and credibility</PageHeading>
            <Text className="text-zinc-400">
              Every feature serves a genuine purpose. Build an authentic showcase of your experience without wrestling with boilerplate code.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/40 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-[#356ae6]/10 border border-[#356ae6]/30 flex items-center justify-center text-[#356ae6]">
                <Layout className="w-5 h-5" />
              </div>
              <SectionHeading as="h3">Verified Template Registry</SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Distinct editorial and engineering templates consuming the exact same canonical data model. Switch aesthetics at any time without re-entering your projects.
              </Text>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/40 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <Eye className="w-5 h-5" />
              </div>
              <SectionHeading as="h3">Real-Time Split Studio</SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Update profile, work tenure, technical competencies, and case studies while observing instant synchronization in responsive desktop and mobile frames.
              </Text>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/40 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <SectionHeading as="h3">Grounded AI Assistance</SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Provide raw notes or career bullet points. Portfolify structures them into verified schema fields with an interactive diff review modal before any content is applied.
              </Text>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/40 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <Globe className="w-5 h-5" />
              </div>
              <SectionHeading as="h3">Live Public Routing</SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Publish your portfolio to a unique, clean slug. Full server-rendered HTML with dynamic OpenGraph meta tags, and instant unpublish controls.
              </Text>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/40 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <Sliders className="w-5 h-5" />
              </div>
              <SectionHeading as="h3">Flexible Section Control</SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Toggle section visibility individually. Templates gracefully omit empty sections with zero awkward gaps or placeholder artifacts.
              </Text>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/40 space-y-4 hover:border-zinc-700 transition-colors">
              <div className="h-10 w-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
              </div>
              <SectionHeading as="h3">Zero Dummy Data Policy</SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                No fake reviews, fabricated customer logos, or simulated metrics. Portfolify begins genuinely empty and honors your verified experience.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section id="how-it-works" className="py-20 md:py-28 border-b border-[#303238]">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Badge variant="blue">Simple Workflow</Badge>
            <PageHeading>How Portfolify works</PageHeading>
            <Text className="text-zinc-400">
              A transparent, 4-step workflow from empty canvas to live, shareable portfolio.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: "01",
                title: "Choose a design",
                desc: "Select between Minimal Portfolio (editorial) or Developer Pro (technical) from the verified registry.",
              },
              {
                step: "02",
                title: "Add your information",
                desc: "Fill in your projects, career tenure, and skills manually or use grounded AI structuring with live review.",
              },
              {
                step: "03",
                title: "Customize & preview",
                desc: "Toggle sections, fine-tune typography and appearance settings, and preview in real desktop and mobile viewports.",
              },
              {
                step: "04",
                title: "Publish & share",
                desc: "Publish to your unique custom slug with instant server-side persistence and verified OpenGraph tags.",
              },
            ].map((st) => (
              <div
                key={st.step}
                className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 space-y-3 relative"
              >
                <span className="font-mono text-2xl font-bold text-[#356ae6]/80 block">
                  {st.step}
                </span>
                <SectionHeading as="h4" className="text-base text-white">
                  {st.title}
                </SectionHeading>
                <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                  {st.desc}
                </Text>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Template Showcase Section */}
      <section className="py-20 md:py-28 border-b border-[#303238] bg-[#141519]/50">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <Badge variant="blue">Template Gallery</Badge>
              <PageHeading>Curated, responsive designs</PageHeading>
              <Text className="text-zinc-400 text-sm">
                Real templates from the central registry. All templates share the same canonical data model.
              </Text>
            </div>
            <Link href="/templates">
              <Button variant="outline" size="sm" className="gap-1.5 border-zinc-700 text-zinc-200">
                <span>View All Templates</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((tpl) => (
              <div
                key={tpl.metadata.id}
                className="rounded-xl border border-[#303238] bg-[#191B20]/50 overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition-colors"
              >
                <div className="p-6 pb-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#356ae6] font-semibold">
                      {tpl.metadata.category}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500">
                      ID: {tpl.metadata.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-2xl font-bold text-white">{tpl.metadata.name}</h3>
                    <p className="text-xs text-zinc-400 font-light mt-1">
                      {tpl.metadata.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed font-light">
                    {tpl.metadata.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {tpl.metadata.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-mono text-zinc-400 bg-[#101114] border border-zinc-800 px-2 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-zinc-800/80 space-y-2">
                    <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">
                      Key Highlights
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

                <div className="p-5 bg-[#141519] border-t border-[#303238] flex items-center justify-between">
                  <Link href="/templates">
                    <Button variant="outline" size="sm" className="text-xs border-zinc-700 hover:bg-zinc-800">
                      Preview in Gallery
                    </Button>
                  </Link>

                  <Link href={`/editor?template=${tpl.metadata.id}`}>
                    <Button variant="brand" size="sm" className="gap-1.5 text-xs">
                      <span>Use This Template</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Trust and Transparency Section */}
      <section className="py-20 md:py-28 border-b border-[#303238]">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="max-w-2xl space-y-3">
            <Badge variant="blue">Our Principles</Badge>
            <PageHeading>Trust, privacy, and genuine data integrity</PageHeading>
            <Text className="text-zinc-400">
              We reject deceptive product patterns. Portfolify is built around strict data truthfulness.
            </Text>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 space-y-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <SectionHeading as="h4" className="text-base text-white">
                Zero Hallucinations
              </SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Our AI extraction tools will never fabricate achievements, client logos, degrees, or impact metrics. Only information you provide is structured.
              </Text>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 space-y-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <SectionHeading as="h4" className="text-base text-white">
                Canonical Portability
              </SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Your portfolio data is completely decoupled from any single visual layout. You can switch templates anytime without losing a single paragraph.
              </Text>
            </div>

            <div className="p-6 rounded-xl border border-[#303238] bg-[#191B20]/30 space-y-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <SectionHeading as="h4" className="text-base text-white">
                Transparent Persistence
              </SectionHeading>
              <Text className="text-xs text-zinc-400 leading-relaxed font-light">
                Save status badges reflect real database writes. An unpublish action instantly restricts public access without erasing your draft data.
              </Text>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="py-20 md:py-28 border-b border-[#303238] bg-[#141519]/70">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <PageHeading className="text-3xl sm:text-5xl max-w-2xl mx-auto">
            Ready to build your professional portfolio?
          </PageHeading>

          <Text className="text-zinc-400 max-w-xl mx-auto text-base font-light leading-relaxed">
            Start with an empty canvas or your preferred template. Edit with instant live feedback, and publish when you are ready.
          </Text>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/editor" className="w-full sm:w-auto">
              <Button variant="brand" size="lg" className="w-full sm:w-auto gap-2 shadow-sm font-semibold">
                <span>Build your portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/templates" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-zinc-700 text-zinc-200 hover:bg-zinc-900">
                Explore templates
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Footer */}
      <footer className="py-12 bg-[#101114] text-xs text-zinc-500">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-6 w-6 rounded bg-[#356ae6] flex items-center justify-center text-white font-mono text-xs font-bold">
              P
            </div>
            <span className="font-semibold text-zinc-300">Portfolify</span>
            <span>—</span>
            <span>AI-Assisted Portfolio Engine</span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-zinc-400">
            <Link href="/templates" className="hover:text-white transition-colors">
              Templates
            </Link>
            <a href="#features" className="hover:text-white transition-colors">
              Capabilities
            </a>
            <a href="#how-it-works" className="hover:text-white transition-colors">
              How It Works
            </a>
            <Link href="/editor" className="hover:text-white transition-colors">
              Studio Editor
            </Link>
            <Link href="/design-system" className="hover:text-white transition-colors">
              Design System
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
