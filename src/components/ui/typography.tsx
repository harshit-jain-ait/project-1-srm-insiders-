import * as React from "react";
import { cn } from "@/lib/utils";

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export function DisplayHeading({
  className,
  as: Component = "h1",
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.12] text-foreground text-balance",
        className
      )}
      {...props}
    />
  );
}

export function PageHeading({
  className,
  as: Component = "h1",
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-balance",
        className
      )}
      {...props}
    />
  );
}

export function SectionHeading({
  className,
  as: Component = "h2",
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "text-lg sm:text-xl font-semibold tracking-tight text-foreground text-balance",
        className
      )}
      {...props}
    />
  );
}

export function CardHeading({
  className,
  as: Component = "h3",
  ...props
}: HeadingProps) {
  return (
    <Component
      className={cn(
        "text-base font-semibold leading-snug text-foreground",
        className
      )}
      {...props}
    />
  );
}

export function Text({
  className,
  as: Component = "p",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Component
      className={cn("text-sm sm:text-base leading-relaxed text-foreground/90", className)}
      {...props}
    />
  );
}

export function MutedText({
  className,
  as: Component = "p",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Component
      className={cn("text-xs sm:text-sm text-zinc-400 dark:text-zinc-400 leading-normal", className)}
      {...props}
    />
  );
}

export function Caption({
  className,
  as: Component = "span",
  ...props
}: React.HTMLAttributes<HTMLElement> & { as?: React.ElementType }) {
  return (
    <Component
      className={cn(
        "text-xs font-mono uppercase tracking-wider text-zinc-400 select-none",
        className
      )}
      {...props}
    />
  );
}

export function CodeText({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        "font-mono text-xs bg-zinc-800/60 text-zinc-200 border border-zinc-700/60 px-1.5 py-0.5 rounded",
        className
      )}
      {...props}
    />
  );
}
