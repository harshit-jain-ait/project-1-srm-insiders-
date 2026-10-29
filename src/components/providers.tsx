"use client";

import { RocketCursor } from "@/components/ui/rocket-cursor";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <RocketCursor />
      {children}
    </ThemeProvider>
  );
}
