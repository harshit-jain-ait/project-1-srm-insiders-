"use client";

import React, { useState } from "react";
import { Profile, SocialLink, SocialLinkPlatform, isSafeHttpUrl } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { FormLabel, FormHelperText, FormErrorMessage } from "@/components/ui/form-field";
import { Plus, Trash2, Globe, AlertCircle } from "lucide-react";

interface ProfileFormProps {
  profile: Profile;
  socialLinks: SocialLink[];
  onProfileChange: (profile: Profile) => void;
  onSocialLinksChange: (links: SocialLink[]) => void;
}

const PLATFORM_OPTIONS: { value: SocialLinkPlatform; label: string }[] = [
  { value: "github", label: "GitHub" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter / X" },
  { value: "website", label: "Personal Website" },
  { value: "email", label: "Email Address" },
  { value: "dribbble", label: "Dribbble" },
  { value: "behance", label: "Behance" },
  { value: "other", label: "Other" },
];

export function ProfileForm({
  profile,
  socialLinks,
  onProfileChange,
  onSocialLinksChange,
}: ProfileFormProps) {
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const updateField = (field: keyof Profile, value: string) => {
    if (field === "avatarUrl") {
      if (value && !isSafeHttpUrl(value)) {
        setAvatarError("Must be a valid HTTP or HTTPS address");
      } else {
        setAvatarError(null);
      }
    }
    onProfileChange({
      ...profile,
      [field]: value,
    });
  };

  // Social Links management
  const handleAddSocialLink = () => {
    const newLink: SocialLink = {
      id: `link_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      platform: "github",
      label: "GitHub",
      url: "https://github.com/",
    };
    onSocialLinksChange([...socialLinks, newLink]);
  };

  const handleUpdateSocialLink = (id: string, updates: Partial<SocialLink>) => {
    onSocialLinksChange(
      socialLinks.map((link) => (link.id === id ? { ...link, ...updates } : link))
    );
  };

  const handleRemoveSocialLink = (id: string) => {
    onSocialLinksChange(socialLinks.filter((link) => link.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white">Profile & Identity</h3>
        <p className="text-xs text-zinc-400">
          Core information displayed on your portfolio hero and about sections.
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div>
          <FormLabel htmlFor="profile-fullName" required>
            Full Name
          </FormLabel>
          <Input
            id="profile-fullName"
            value={profile.fullName}
            onChange={(e) => updateField("fullName", e.target.value)}
            placeholder="e.g. Alex Rivera"
            maxLength={100}
          />
          <FormHelperText>Visible in page titles and hero headers.</FormHelperText>
        </div>

        {/* Professional Headline */}
        <div>
          <FormLabel htmlFor="profile-headline">Professional Headline</FormLabel>
          <Input
            id="profile-headline"
            value={profile.headline}
            onChange={(e) => updateField("headline", e.target.value)}
            placeholder="e.g. Staff Cloud Systems Architect"
            maxLength={140}
          />
          <FormHelperText>Short summary of your role or specialization.</FormHelperText>
        </div>

        {/* Short Biography */}
        <div>
          <div className="flex items-center justify-between">
            <FormLabel htmlFor="profile-bio">Summary / Bio</FormLabel>
            <span className="text-[10px] text-zinc-500 font-mono">
              {profile.bio.length} / 600
            </span>
          </div>
          <Textarea
            id="profile-bio"
            value={profile.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            placeholder="Concise overview of your career, philosophy, and architectural strengths."
            rows={4}
            maxLength={600}
          />
          <FormHelperText>Appears prominently in the primary portfolio section.</FormHelperText>
        </div>

        {/* Extended Biography */}
        <div>
          <div className="flex items-center justify-between">
            <FormLabel htmlFor="profile-longBio">Extended Biography (Optional)</FormLabel>
            <span className="text-[10px] text-zinc-500 font-mono">
              {profile.longBio.length} / 2000
            </span>
          </div>
          <Textarea
            id="profile-longBio"
            value={profile.longBio}
            onChange={(e) => updateField("longBio", e.target.value)}
            placeholder="In-depth background, career highlights, or case study context for publication templates."
            rows={5}
            maxLength={2000}
          />
        </div>

        {/* Grid: Location & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FormLabel htmlFor="profile-location">Location</FormLabel>
            <Input
              id="profile-location"
              value={profile.location}
              onChange={(e) => updateField("location", e.target.value)}
              placeholder="e.g. San Francisco, CA"
            />
          </div>
          <div>
            <FormLabel htmlFor="profile-email">Public Contact Email</FormLabel>
            <Input
              id="profile-email"
              type="email"
              value={profile.email}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="e.g. alex@example.com"
            />
          </div>
        </div>

        {/* Grid: Status Badge & Avatar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <FormLabel htmlFor="profile-status">Status Badge</FormLabel>
            <Input
              id="profile-status"
              value={profile.statusBadge}
              onChange={(e) => updateField("statusBadge", e.target.value)}
              placeholder="e.g. Open to Q1 Advisory"
            />
          </div>
          <div>
            <FormLabel htmlFor="profile-avatar">Profile Image URL</FormLabel>
            <Input
              id="profile-avatar"
              value={profile.avatarUrl}
              onChange={(e) => updateField("avatarUrl", e.target.value)}
              placeholder="https://..."
              hasError={Boolean(avatarError)}
            />
            {avatarError && <FormErrorMessage message={avatarError} />}
          </div>
        </div>
      </div>

      {/* Social and Professional Links */}
      <div className="pt-4 border-t border-zinc-850 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs font-semibold text-zinc-200">Social & External Links</h4>
            <p className="text-[11px] text-zinc-400">
              Links to your repositories, professional networks, and personal sites.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddSocialLink}
            className="h-7 text-xs gap-1 border-zinc-700 text-zinc-300 hover:text-white"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Link</span>
          </Button>
        </div>

        {socialLinks.length === 0 ? (
          <div className="p-4 rounded border border-dashed border-zinc-800 text-center text-xs text-zinc-500">
            No social links added yet. Click &quot;Add Link&quot; to connect GitHub, LinkedIn, or personal profiles.
          </div>
        ) : (
          <div className="space-y-3">
            {socialLinks.map((link) => {
              const isInvalidUrl = link.url.trim() !== "" && !isSafeHttpUrl(link.url) && !link.url.startsWith("mailto:");
              return (
                <div
                  key={link.id}
                  className="p-3 rounded-lg border border-zinc-850 bg-zinc-900/60 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-36 shrink-0">
                      <Select
                        value={link.platform}
                        onChange={(e) => {
                          const newPlatform = e.target.value as SocialLinkPlatform;
                          const found = PLATFORM_OPTIONS.find((p) => p.value === newPlatform);
                          handleUpdateSocialLink(link.id, {
                            platform: newPlatform,
                            label: found?.label || newPlatform,
                          });
                        }}
                        options={PLATFORM_OPTIONS}
                        className="h-8 text-xs bg-zinc-950"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={link.label}
                        onChange={(e) => handleUpdateSocialLink(link.id, { label: e.target.value })}
                        placeholder="Label"
                        className="h-8 text-xs"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSocialLink(link.id)}
                      className="h-8 w-8 p-0 text-zinc-500 hover:text-red-400"
                      aria-label={`Remove ${link.label} link`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>

                  <div>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-zinc-500" />
                      <Input
                        value={link.url}
                        onChange={(e) => handleUpdateSocialLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="h-8 text-xs pl-8 font-mono"
                        hasError={isInvalidUrl}
                      />
                    </div>
                    {isInvalidUrl && (
                      <div className="flex items-center gap-1 text-[11px] text-red-400 mt-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Must be a valid URL starting with http:// or https://</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
