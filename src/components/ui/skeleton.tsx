import * as React from "react";
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-zinc-850/70 dark:bg-zinc-800/60 select-none",
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}
