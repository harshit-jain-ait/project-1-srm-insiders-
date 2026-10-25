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
  const portfolio = await portfolioRepository.getBySlug(slug, { onlyPublished: true });

  if (!portfolio || !portfolio.published) {
    return {
      title: "Portfolio Not Found | Portfolify",
      description: "The requested portfolio is unavailable or currently unpublished.",
      robots: { index: false, follow: false },
    };
  }

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const name = portfolio.profile.fullName || "Professional Portfolio";
  const headline = portfolio.profile.headline ? ` — ${portfolio.profile.headline}` : "";

  const title = portfolio.seo?.title?.trim() || `${name}${headline}`;
  const description =
    portfolio.seo?.description?.trim() ||
    portfolio.profile.bio?.trim() ||
    `Professional portfolio of ${name}.`;

  const canonical =
    portfolio.seo?.canonicalUrl?.trim() ||
    (portfolio.customDomain?.status === "active" && portfolio.customDomain?.domain
      ? `https://${portfolio.customDomain.domain}`
      : `${appBaseUrl}/p/${slug}`);

  const ogImages = portfolio.seo?.ogImage
    ? [{ url: portfolio.seo.ogImage, alt: title }]
    : portfolio.profile.avatarUrl
    ? [{ url: portfolio.profile.avatarUrl, alt: name }]
    : [];

  const noIndex = portfolio.seo?.noIndex ?? false;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Portfolify",
      type: "website",
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImages.map((img) => img.url),
    },
  };
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { slug } = await params;
  const portfolio = await portfolioRepository.getBySlug(slug, { onlyPublished: true });

  if (!portfolio || !portfolio.published) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
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
