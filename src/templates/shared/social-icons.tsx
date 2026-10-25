import React from "react";
import { SocialLinkPlatform } from "@/lib/schema/portfolio";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/icons";
import { Globe, Mail, ExternalLink } from "lucide-react";

interface SocialPlatformIconProps {
  platform: SocialLinkPlatform;
  className?: string;
}

export function SocialPlatformIcon({ platform, className = "w-3.5 h-3.5" }: SocialPlatformIconProps) {
  switch (platform) {
    case "github":
      return <GithubIcon className={className} />;
    case "linkedin":
      return <LinkedinIcon className={className} />;
    case "twitter":
      return <TwitterIcon className={className} />;
    case "email":
      return <Mail className={className} />;
    case "website":
      return <Globe className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
}
