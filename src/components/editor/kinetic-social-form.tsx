"use client";

import React from "react";
import { SocialLink } from "@/lib/schema/portfolio";
import { GithubIcon, LinkedinIcon, InstagramIcon } from "@/components/ui/icons";
import { Link2 } from "lucide-react";

interface KineticSocialFormProps {
  socialLinks: SocialLink[];
  onSocialLinksChange: (links: SocialLink[]) => void;
}

export function KineticSocialForm({ socialLinks, onSocialLinksChange }: KineticSocialFormProps) {
  // Find each dedicated link
  const githubLink = socialLinks.find((l) => l.platform === "github");
  const linkedinLink = socialLinks.find((l) => l.platform === "linkedin");
  const instagramLink = socialLinks.find(
    (l) => l.platform === "other" && l.label?.toLowerCase().includes("instagram")
  );
  // Optional other link
  const optionalOtherLink = socialLinks.find(
    (l) =>
      l.platform !== "github" &&
      l.platform !== "linkedin" &&
      !(l.platform === "other" && l.label?.toLowerCase().includes("instagram"))
  );

  const updateLink = (
    matcher: (l: SocialLink) => boolean,
    platform: SocialLink["platform"],
    defaultLabel: string,
    newUrl: string,
    customLabel?: string
  ) => {
    const existingIndex = socialLinks.findIndex(matcher);
    if (!newUrl.trim()) {
      // Remove if cleared
      if (existingIndex !== -1) {
        onSocialLinksChange(socialLinks.filter((_, i) => i !== existingIndex));
      }
      return;
    }

    if (existingIndex !== -1) {
      const updated = [...socialLinks];
      updated[existingIndex] = {
        ...updated[existingIndex],
        url: newUrl.trim(),
        label: customLabel || updated[existingIndex].label || defaultLabel,
      };
      onSocialLinksChange(updated);
    } else {
      const newLink: SocialLink = {
        id: `social_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        platform,
        label: customLabel || defaultLabel,
        url: newUrl.trim(),
      };
      onSocialLinksChange([...socialLinks, newLink]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="pb-2 border-b border-slate-800/80">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider">Social Links</h3>
        <p className="text-[10px] text-slate-400 mt-0.5">
          Connect your GitHub, LinkedIn, Instagram, and one optional link.
        </p>
      </div>

      {/* 1. GitHub */}
      <div className="space-y-1.5 p-3 rounded-xl bg-[#0c101a] border border-slate-800">
        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
          <GithubIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>GitHub</span>
        </label>
        <input
          type="url"
          value={githubLink?.url || ""}
          onChange={(e) =>
            updateLink(
              (l) => l.platform === "github",
              "github",
              "GitHub",
              e.target.value
            )
          }
          placeholder="https://github.com/username"
          className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* 2. LinkedIn */}
      <div className="space-y-1.5 p-3 rounded-xl bg-[#0c101a] border border-slate-800">
        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
          <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>LinkedIn</span>
        </label>
        <input
          type="url"
          value={linkedinLink?.url || ""}
          onChange={(e) =>
            updateLink(
              (l) => l.platform === "linkedin",
              "linkedin",
              "LinkedIn",
              e.target.value
            )
          }
          placeholder="https://linkedin.com/in/username"
          className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      {/* 3. Instagram */}
      <div className="space-y-1.5 p-3 rounded-xl bg-[#0c101a] border border-slate-800">
        <label className="text-[11px] font-semibold text-slate-300 flex items-center gap-1.5">
          <InstagramIcon className="w-3.5 h-3.5 text-pink-400" />
          <span>Instagram</span>
        </label>
        <input
          type="url"
          value={instagramLink?.url || ""}
          onChange={(e) =>
            updateLink(
              (l) => l.platform === "other" && l.label?.toLowerCase().includes("instagram"),
              "other",
              "Instagram",
              e.target.value
            )
          }
          placeholder="https://instagram.com/username"
          className="w-full px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors"
        />
      </div>

      {/* 4. Optional Other */}
      <div className="space-y-2 p-3 rounded-xl bg-[#0c101a] border border-slate-800/80">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
            <Link2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Other Link</span>
            <span className="text-[10px] text-slate-500 font-normal">(Optional)</span>
          </label>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input
            type="text"
            value={optionalOtherLink?.label || ""}
            onChange={(e) => {
              if (optionalOtherLink) {
                const updated = socialLinks.map((l) =>
                  l.id === optionalOtherLink.id ? { ...l, label: e.target.value } : l
                );
                onSocialLinksChange(updated);
              }
            }}
            placeholder="Label (e.g. Website, X)"
            className="col-span-1 px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
          <input
            type="url"
            value={optionalOtherLink?.url || ""}
            onChange={(e) =>
              updateLink(
                (l) =>
                  l.platform !== "github" &&
                  l.platform !== "linkedin" &&
                  !(l.platform === "other" && l.label?.toLowerCase().includes("instagram")),
                "other",
                optionalOtherLink?.label || "Website",
                e.target.value,
                optionalOtherLink?.label || "Website"
              )
            }
            placeholder="https://example.com"
            className="col-span-2 px-2.5 py-1.5 rounded-lg bg-[#080b12] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

export default KineticSocialForm;

