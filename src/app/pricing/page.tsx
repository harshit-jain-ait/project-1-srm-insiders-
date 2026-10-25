import React from "react";
import { Metadata } from "next";
import { PLANS } from "@/lib/billing/plans";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Check, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Plans & Pricing | Portfolify",
  description: "Transparent, honest pricing for developers and creators. Free essential tier and Pro plan for ambitious professionals.",
};

export default function PricingPage() {
  const freePlan = PLANS.free;
  const proPlan = PLANS.pro;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-white tracking-tight flex items-center gap-2">
            <span className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
              P
            </span>
            Portfolify
          </Link>

          <div className="flex items-center gap-4 text-xs font-medium">
            <Link href="/templates" className="text-zinc-400 hover:text-white transition-colors">
              Templates
            </Link>
            <Link href="/editor" className="text-zinc-400 hover:text-white transition-colors">
              Editor
            </Link>
            <Link href="/generate">
              <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8">
                Build Portfolio &rarr;
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="max-w-4xl mx-auto px-6 pt-16 pb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 font-medium">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Transparent pricing • Cancel anytime • Zero hidden lock-in</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">
          Predictable plans for real careers.
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed">
          Start for free to create and publish a credible portfolio. Upgrade to Pro when you need custom domains, extended analytics, and distinctive premium design systems.
        </p>
      </div>

      {/* Plan Cards */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
          {/* Free Tier */}
          <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                  {freePlan.name}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-medium">
                  Free Forever
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">$0</span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">{freePlan.tagline}</p>

              <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                <span className="text-xs font-semibold text-zinc-300">Included features:</span>
                <ul className="space-y-2.5 text-xs text-zinc-300">
                  {freePlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/editor" className="w-full">
              <Button
                variant="outline"
                className="w-full h-10 text-xs border-zinc-800 text-zinc-200 hover:bg-zinc-800"
              >
                Get Started Free
              </Button>
            </Link>
          </div>

          {/* Pro Tier */}
          <div className="rounded-2xl border border-blue-900/60 bg-gradient-to-b from-blue-950/20 via-zinc-900/60 to-zinc-900/40 p-8 flex flex-col justify-between space-y-8 relative shadow-xl">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-400 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {proPlan.name}
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-800 text-blue-300 font-medium">
                  Most Popular
                </span>
              </div>

              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-white tracking-tight">
                  ${proPlan.priceMonthly}
                </span>
                <span className="text-xs text-zinc-400">/ month</span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed">{proPlan.tagline}</p>

              <div className="pt-4 border-t border-zinc-800/80 space-y-3">
                <span className="text-xs font-semibold text-white">Everything in Free, plus:</span>
                <ul className="space-y-2.5 text-xs text-zinc-200">
                  {proPlan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Link href="/editor" className="w-full">
              <Button className="w-full h-10 text-xs bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-md">
                Upgrade to Pro <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Feature Comparison Matrix */}
      <div className="max-w-4xl mx-auto px-6 py-16 border-t border-zinc-900">
        <h3 className="text-lg font-bold text-white text-center mb-8">Detailed Entitlement Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="py-3 px-4 font-semibold">Capability</th>
                <th className="py-3 px-4 font-semibold">Free</th>
                <th className="py-3 px-4 font-semibold text-blue-400">Pro</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-zinc-300">
              <tr>
                <td className="py-3 px-4 font-medium text-white">Active Portfolios</td>
                <td className="py-3 px-4">Up to 2</td>
                <td className="py-3 px-4 font-semibold text-white">Up to 25</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Included Templates</td>
                <td className="py-3 px-4">Minimal Portfolio, Developer Pro</td>
                <td className="py-3 px-4 font-semibold text-white">All 7 Templates (including Editorial Studio & Creative Motion)</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Custom Domain DNS</td>
                <td className="py-3 px-4 text-zinc-500">portfolify.dev subpaths</td>
                <td className="py-3 px-4 font-semibold text-emerald-400">Custom Apex & Subdomains + SSL</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Visitor Analytics Retention</td>
                <td className="py-3 px-4">7 Days</td>
                <td className="py-3 px-4 font-semibold text-white">365 Days</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Version History Snapshots</td>
                <td className="py-3 px-4">3 Revisions</td>
                <td className="py-3 px-4 font-semibold text-white">30 Revisions</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">Visitor Contact Inquiries</td>
                <td className="py-3 px-4">50 / month</td>
                <td className="py-3 px-4 font-semibold text-white">Unlimited</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium text-white">AI Generation & Writing Quota</td>
                <td className="py-3 px-4">10 operations / month</td>
                <td className="py-3 px-4 font-semibold text-white">150 operations / month</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-12 text-center text-xs text-zinc-500">
        <p>Portfolify • Engineered for career credibility. No hidden subscriptions.</p>
      </footer>
    </div>
  );
}
