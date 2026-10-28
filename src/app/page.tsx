import React from "react";
import { headers } from "next/headers";
import { Metadata } from "next";
import { portfolioRepository } from "@/lib/services/portfolio-repository";
import { PortfolioRenderer } from "@/templates/renderer";
import { LandingPageView } from "@/components/landing/landing-page-view";

export async function generateMetadata(): Promise<Metadata> {
  const headerList = await headers();
  const host = headerList.get("host")?.split(":")[0]?.toLowerCase() || "";
  const isAppDomain = host === "localhost" || host === "127.0.0.1" || host.includes("portfolify");

  if (!isAppDomain && host) {
    const portfolio = await portfolioRepository.getByCustomDomain(host);
    if (portfolio && portfolio.published) {
      const name = portfolio.profile.fullName || "Professional Portfolio";
      const headline = portfolio.profile.headline ? ` — ${portfolio.profile.headline}` : "";
      const title = portfolio.seo?.title?.trim() || `${name}${headline}`;
      const description =
        portfolio.seo?.description?.trim() ||
        portfolio.profile.bio?.trim() ||
        `Professional portfolio of ${name}.`;

      return {
        title,
        description,
        alternates: {
          canonical: `https://${host}`,
        },
        openGraph: {
          title,
          description,
          url: `https://${host}`,
          type: "website",
        },
      };
    }
  }

  return {
    title: "Portfolify — Your work deserves a better stage.",
    description:
      "Build a portfolio that reflects your work, your style, and your story — with a visual editor and thoughtfully designed templates.",
  };
}

export default async function HomePage() {
  const headerList = await headers();
  const host = headerList.get("host")?.split(":")[0]?.toLowerCase() || "";
  const isAppDomain = host === "localhost" || host === "127.0.0.1" || host.includes("portfolify");

  if (!isAppDomain && host) {
    const customPortfolio = await portfolioRepository.getByCustomDomain(host);
    if (customPortfolio && customPortfolio.published) {
      return <PortfolioRenderer portfolio={customPortfolio} isLivePreview={false} />;
    }
  }

  return <LandingPageView />;
}
