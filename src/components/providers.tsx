"use client";

import { SmokeCursor } from "@/components/ui/smoke-cursor";
import { ThemeProvider } from "@/components/theme-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <SmokeCursor />
      {children}
    </ThemeProvider>
  );
}
