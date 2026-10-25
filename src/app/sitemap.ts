import { MetadataRoute } from "next";
import { portfolioRepository } from "@/lib/services/portfolio-repository";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // Static Platform Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${appBaseUrl}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${appBaseUrl}/templates`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${appBaseUrl}/generate`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${appBaseUrl}/import-url`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${appBaseUrl}/import-resume`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${appBaseUrl}/design-system`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic Published Portfolio Routes
  try {
    const publishedPortfolios = await portfolioRepository.listAllPublished();

    const portfolioRoutes: MetadataRoute.Sitemap = publishedPortfolios
      // Exclude portfolios flagged as noIndex or opted-out of sitemap
      .filter((p) => !p.seo?.noIndex && p.seo?.includeInSitemap !== false)
      .map((p) => {
        const canonicalUrl =
          p.seo?.canonicalUrl?.trim() ||
          (p.customDomain?.status === "active" && p.customDomain?.domain
            ? `https://${p.customDomain.domain}`
            : `${appBaseUrl}/p/${p.slug}`);

        return {
          url: canonicalUrl,
          lastModified: new Date(p.publishedAt || p.updatedAt || new Date()),
          changeFrequency: "weekly",
          priority: 0.7,
        };
      });

    return [...staticRoutes, ...portfolioRoutes];
  } catch (err) {
    console.error("[sitemap] Failed to query published portfolios:", err);
    return staticRoutes;
  }
}
