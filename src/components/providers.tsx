"use client";

import { SmokeCursor } from "@/components/ui/smoke-cursor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmokeCursor />
      {children}
    </>
  );
}

