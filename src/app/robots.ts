import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/templates", "/p/*", "/design-system"],
        disallow: [
          "/api/*",
          "/editor*",
          "/*?*claimToken*",
          "/import-resume*",
        ],
      },
    ],
    sitemap: `${appBaseUrl}/sitemap.xml`,
  };
}
