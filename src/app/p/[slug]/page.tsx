import { Metadata } from "next";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { PortfolioRenderer } from "@/templates/renderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const portfolio = await portfolioRepository.getBySlug(slug);

  if (!portfolio || !portfolio.published) {
    return {
      title: "Portfolio Not Found | Portfolify",
      description: "The requested portfolio is unavailable or currently unpublished.",
    };
  }

  const name = portfolio.profile.fullName || "Professional Portfolio";
  const headline = portfolio.profile.headline ? ` — ${portfolio.profile.headline}` : "";

  return {
    title: `${name}${headline}`,
    description: portfolio.profile.bio || `Professional portfolio of ${name}.`,
    openGraph: {
      title: `${name}${headline}`,
      description: portfolio.profile.bio || `Professional portfolio of ${name}.`,
      type: "website",
    },
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await portfolioRepository.getBySlug(slug);

  if (!portfolio || !portfolio.published) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-xl border border-zinc-800 bg-zinc-900/50">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 mb-2">
            404
          </div>
          <h1 className="text-xl font-semibold text-white">Portfolio Unavailable</h1>
          <p className="text-sm text-zinc-400">
            This portfolio is either unpublished, does not exist, or is currently in draft mode.
          </p>
          <div className="pt-2">
            <Link href="/">
              <Button variant="outline" size="sm">
                Return to Portfolify
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return <PortfolioRenderer portfolio={portfolio} isLivePreview={false} />;
}
