"use client";

import React from "react";
import { SeoSettings, isSafeHttpUrl } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormLabel, FormHelperText, FormErrorMessage } from "@/components/ui/form-field";
import { Search, Globe } from "lucide-react";

interface SeoFormProps {
  seo: SeoSettings;
  portfolioTitle: string;
  fullName: string;
  headline?: string;
  slug: string;
  customDomain?: string;
  onSeoChange: (updated: SeoSettings) => void;
}

export function SeoForm({
  seo,
  portfolioTitle,
  fullName,
  headline,
  slug,
  customDomain,
  onSeoChange,
}: SeoFormProps) {
  const appBaseUrl =
    typeof window !== "undefined"
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL || "https://portfolify.dev";

  const defaultTitle = fullName
    ? `${fullName}${headline ? ` — ${headline}` : ""}`
    : portfolioTitle || "Professional Portfolio";

  const effectiveTitle = seo.title.trim() || defaultTitle;
  const effectiveDescription =
    seo.description.trim() ||
    `Explore the professional portfolio and engineering projects of ${fullName || "our featured creator"}.`;

  const canonicalDisplayUrl = customDomain
    ? `https://${customDomain}`
    : `${appBaseUrl}/p/${slug}`;

  const updateField = <K extends keyof SeoSettings>(field: K, value: SeoSettings[K]) => {
    onSeoChange({
      ...seo,
      [field]: value,
    });
  };

  const isImageValid = seo.ogImage ? isSafeHttpUrl(seo.ogImage) : true;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-blue-400" />
          <span>Search Engine Optimization (SEO) & Social Sharing</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Configure how your portfolio appears in Google search results and when shared on LinkedIn, X, or messaging apps.
        </p>
      </div>

      {/* Google Search Result Preview Card */}
      <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-2">
        <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-mono">
          <Globe className="w-3.5 h-3.5 text-zinc-500" />
          <span className="truncate">{canonicalDisplayUrl}</span>
        </div>
        <h4 className="text-base font-medium text-blue-400 hover:underline cursor-pointer truncate">
          {effectiveTitle}
        </h4>
        <p className="text-xs text-zinc-300 line-clamp-2 leading-relaxed">
          {effectiveDescription}
        </p>
      </div>

      <div className="space-y-4">
        {/* SEO Title */}
        <div>
          <div className="flex items-center justify-between">
            <FormLabel htmlFor="seo-title">Custom Page Title</FormLabel>
            <span className="text-[10px] text-zinc-500 font-mono">
              {seo.title.length} / 100
            </span>
          </div>
          <Input
            id="seo-title"
            value={seo.title}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder={`e.g. ${defaultTitle}`}
            maxLength={100}
          />
          <FormHelperText>
            Shown in the browser tab and search headlines. Recommended: 50-60 characters.
          </FormHelperText>
        </div>

        {/* Meta Description */}
        <div>
          <div className="flex items-center justify-between">
            <FormLabel htmlFor="seo-desc">Meta Description</FormLabel>
            <span className="text-[10px] text-zinc-500 font-mono">
              {seo.description.length} / 300
            </span>
          </div>
          <Textarea
            id="seo-desc"
            value={seo.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="A compelling, factual 1-2 sentence overview of your skills, achievements, and specialization."
            rows={3}
            maxLength={300}
          />
          <FormHelperText>
            Summarizes your portfolio content in search engines and social cards.
          </FormHelperText>
        </div>

        {/* Social Share Image URL */}
        <div>
          <FormLabel htmlFor="seo-ogImage">Social Share Image (Open Graph)</FormLabel>
          <div className="flex items-center gap-2">
            <Input
              id="seo-ogImage"
              value={seo.ogImage}
              onChange={(e) => updateField("ogImage", e.target.value)}
              placeholder="https://example.com/social-preview.png"
              hasError={!isImageValid}
            />
          </div>
          {!isImageValid && (
            <FormErrorMessage message="Must be a valid HTTP or HTTPS address" />
          )}
          <FormHelperText>
            Recommended size: 1200 x 630 px. Leave blank to automatically use your profile photo.
          </FormHelperText>

          {seo.ogImage && isImageValid && (
            <div className="mt-2.5 p-2 rounded-lg border border-zinc-800 bg-zinc-950/60 flex items-center gap-3">
              <div className="h-12 w-20 rounded bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={seo.ogImage}
                  alt="Open Graph preview"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = "none";
                  }}
                />
              </div>
              <div className="text-xs text-zinc-400">
                <span className="text-zinc-200 font-medium">Image Configured</span>
                <p className="text-[11px] text-zinc-500 truncate max-w-xs">{seo.ogImage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Indexing Preferences */}
        <div className="pt-2 border-t border-zinc-850 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">
                Search Engine Indexing
              </span>
              <p className="text-[11px] text-zinc-400">
                When enabled, search engines are permitted to index this page (`index, follow`).
              </p>
            </div>
            <Switch
              id="seo-index-toggle"
              checked={!seo.noIndex}
              onCheckedChange={(checked) => updateField("noIndex", !checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-zinc-200">
                Include in Public Sitemap
              </span>
              <p className="text-[11px] text-zinc-400">
                Lists your canonical portfolio URL in `/sitemap.xml` for discoverability.
              </p>
            </div>
            <Switch
              id="seo-sitemap-toggle"
              checked={seo.includeInSitemap}
              onCheckedChange={(checked) => updateField("includeInSitemap", checked)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
