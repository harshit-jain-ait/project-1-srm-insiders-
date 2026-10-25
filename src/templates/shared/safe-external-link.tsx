import React from "react";
import { isSafeHttpUrl } from "@/lib/schema/portfolio";
import { ExternalLink } from "lucide-react";

interface SafeExternalLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  showIcon?: boolean;
  iconClassName?: string;
}

/**
 * Accessible, secure external link component.
 * Validates protocol safety and enforces rel="noopener noreferrer".
 */
export function SafeExternalLink({
  href,
  children,
  showIcon = false,
  iconClassName = "w-3.5 h-3.5 opacity-60",
  className,
  ...props
}: SafeExternalLinkProps) {
  if (!isSafeHttpUrl(href)) {
    return <span className={className}>{children}</span>;
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      {...props}
    >
      <span>{children}</span>
      {showIcon && <ExternalLink className={iconClassName} aria-hidden="true" />}
    </a>
  );
}
