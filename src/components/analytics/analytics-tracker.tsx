"use client";

import { useEffect, useRef } from "react";

interface AnalyticsTrackerProps {
  portfolioId: string;
  path?: string;
}

/**
 * Lightweight, non-blocking client-side analytics beacon for published portfolios.
 * Excludes editor previews and respects browser privacy.
 */
export function AnalyticsTracker({ portfolioId, path = "/" }: AnalyticsTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current || typeof window === "undefined") return;

    // Do not track if in local editor preview or preview param is passed
    const isPreview =
      window.location.search.includes("preview=true") ||
      document.referrer.includes("/editor");

    if (isPreview) return;

    trackedRef.current = true;

    const payload = JSON.stringify({
      portfolioId,
      path,
      referrer: document.referrer || "",
    });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/analytics/collect", blob);
      } else {
        fetch("/api/analytics/collect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // Silent catch to prevent any visitor interruption
        });
      }
    } catch {
      // Ignore beacon failures
    }
  }, [portfolioId, path]);

  return null;
}
