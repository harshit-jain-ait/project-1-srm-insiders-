import { Metadata } from "next";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { CaseStudyRenderer } from "@/components/case-study/case-study-renderer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string; projectId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, projectId } = await params;
  const portfolio = await portfolioRepository.getBySlug(slug, { onlyPublished: true });

  if (!portfolio || !portfolio.published) {
    return {
      title: "Portfolio Unavailable | Portfolify",
      description: "The requested portfolio is unavailable or currently unpublished.",
      robots: { index: false, follow: false },
    };
  }

  const project = (portfolio.projects || []).find((p) => p.id === projectId);

  // Hidden projects must never be exposed or indexed
  if (!project || project.visible === false) {
    return {
      title: "Project Not Found | Portfolify",
      description: "The requested project or case study could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const author = portfolio.profile.fullName || "Portfolio";
  const title = `${project.title} — ${author} | Case Study`;
  const description =
    project.tagline?.trim() ||
    project.caseStudy?.overview?.trim() ||
    project.description?.trim() ||
    `Detailed case study of ${project.title} by ${author}.`;

  const canonical = `${appBaseUrl}/p/${slug}/projects/${project.id}`;

  const ogImages = project.coverImageUrl
    ? [{ url: project.coverImageUrl, alt: project.title }]
    : portfolio.profile.avatarUrl
    ? [{ url: portfolio.profile.avatarUrl, alt: author }]
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
      siteName: `${author} — Portfolify`,
      type: "article",
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

export default async function PublicProjectDetailPage({ params }: Props) {
  const { slug, projectId } = await params;
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

  const project = (portfolio.projects || []).find((p) => p.id === projectId);

  // Hidden projects must not be accessible through direct guessing
  if (!project || project.visible === false) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-zinc-950 text-zinc-100 p-6">
        <div className="max-w-md w-full text-center space-y-4 p-8 rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-xl">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 mb-2">
            404
          </div>
          <h1 className="text-xl font-semibold text-white">Project Not Found</h1>
          <p className="text-sm text-zinc-400">
            This project does not exist or has been made private by the author.
          </p>
          <div className="pt-2">
            <Link href={`/p/${slug}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Portfolio</span>
              </Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-[#356ae6]/30">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <CaseStudyRenderer
          project={project}
          authorName={portfolio.profile.fullName}
          showBackLink={true}
          backHref={`/p/${slug}`}
        />
      </main>
    </div>
  );
}
