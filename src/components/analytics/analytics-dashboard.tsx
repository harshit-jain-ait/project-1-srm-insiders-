"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PortfolioAnalyticsResult } from "@/lib/analytics/analytics-service";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Users,
  Eye,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Laptop,
  ArrowUpRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

interface AnalyticsDashboardProps {
  portfolioId: string;
  isPublished: boolean;
  slug?: string;
  onUpgradeClick?: () => void;
}

export function AnalyticsDashboard({
  portfolioId,
  isPublished,
  slug,
  onUpgradeClick,
}: AnalyticsDashboardProps) {
  const [range, setRange] = useState<"7d" | "30d" | "90d">("7d");
  const [data, setData] = useState<PortfolioAnalyticsResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (selectedRange: "7d" | "30d" | "90d") => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/analytics?range=${selectedRange}`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load analytics");
      }
      setData(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error connecting to analytics service");
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    let isMounted = true;
    fetch(`/api/portfolios/${portfolioId}/analytics?range=${range}`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (!json.success) throw new Error(json.error || "Failed to load analytics");
        setData(json.data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Error connecting to analytics service");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [portfolioId, range]);

  if (!isPublished) {
    return (
      <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-8 text-center max-w-xl mx-auto my-8">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-400">
          <BarChart3 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-medium text-white mb-2">Portfolio is in Draft</h3>
        <p className="text-sm text-zinc-400 mb-6">
          Analytics tracking activates automatically when your portfolio is published. Draft edits and editor previews are intentionally excluded to keep visitor metrics accurate.
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-zinc-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Zero phantom metrics • Privacy-preserving hashing</span>
        </div>
      </div>
    );
  }

  // Calculate highest view count for SVG chart scaling
  const maxViews = data?.timeSeries
    ? Math.max(...data.timeSeries.map((d) => d.views), 1)
    : 1;

  return (
    <div className="space-y-6">
      {/* Header & Range Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div>
          <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Visitor Analytics
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time page views and visitor discovery for{" "}
            <span className="text-zinc-200 font-mono">/p/{slug || portfolioId}</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex bg-zinc-900 border border-zinc-800 rounded-lg p-0.5">
            {(["7d", "30d", "90d"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  range === r
                    ? "bg-zinc-800 text-white shadow-sm"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {r === "7d" ? "Last 7 Days" : r === "30d" ? "Last 30 Days" : "Last 90 Days"}
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => fetchAnalytics(range)}
            disabled={loading}
            className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-800/50 rounded-lg p-4 text-xs text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading && !data ? (
        <div className="py-20 text-center">
          <RefreshCw className="w-6 h-6 animate-spin text-zinc-500 mx-auto mb-3" />
          <p className="text-xs text-zinc-500">Loading verified visitor analytics...</p>
        </div>
      ) : !data || !data.hasData ? (
        /* Honest Empty State */
        <div className="bg-zinc-950/40 border border-zinc-900 rounded-xl p-10 text-center">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-3 text-zinc-500">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-medium text-zinc-200 mb-1">No Visitor Activity Yet</h3>
          <p className="text-xs text-zinc-400 max-w-md mx-auto mb-4">
            Your portfolio is published and actively listening for visitors. Share your link on GitHub, LinkedIn, or Twitter to begin measuring discovery.
          </p>
          <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Tracking active for {data?.effectiveDays || 7} days</span>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Total Views</span>
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {data.totalViews.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Verified page loads</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Unique Visitors</span>
                <Users className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {data.uniqueVisitors.toLocaleString()}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Daily hashed identifiers</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Daily Avg</span>
                <TrendingUp className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {(data.totalViews / Math.max(data.effectiveDays, 1)).toFixed(1)}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">Views per 24 hours</p>
            </div>

            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-4">
              <div className="flex items-center justify-between text-zinc-400 mb-2">
                <span className="text-xs font-medium">Top Source</span>
                <Globe className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight capitalize">
                {data.referrers[0]?.category || "Direct"}
              </div>
              <p className="text-[11px] text-zinc-500 mt-1">
                {data.referrers[0]?.percentage || 100}% of inbound traffic
              </p>
            </div>
          </div>

          {/* Time Series SVG Chart */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">
                  Traffic Trend
                </h3>
                <p className="text-[11px] text-zinc-400">
                  Page views over the last {data.effectiveDays} days
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                  <span>Views</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                  <span>Uniques</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Representation */}
            <div className="h-44 w-full flex items-end gap-1.5 pt-4 pb-2">
              {data.timeSeries.map((item, index) => {
                const heightPercent = Math.max((item.views / maxViews) * 100, 4);
                return (
                  <div
                    key={item.date}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative"
                  >
                    {/* Tooltip on hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 z-20 bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-300 py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap">
                      <div className="font-semibold text-white">{item.date}</div>
                      <div>
                        {item.views} views • {item.uniques} unique
                      </div>
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-blue-600/70 hover:bg-blue-500 rounded-t-sm transition-all"
                    />
                    {/* Date label on every 2nd or 3rd bar if compact */}
                    {(index % Math.ceil(data.timeSeries.length / 7) === 0 ||
                      index === data.timeSeries.length - 1) && (
                      <span className="text-[10px] text-zinc-400 mt-2 truncate w-full text-center">
                        {item.date.slice(5)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown Grid: Top Pages, Referrers, Devices */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Top Pages */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3 flex items-center justify-between">
                <span>Top Pages</span>
                <span className="text-[10px] text-zinc-400 font-normal">Views</span>
              </h3>
              <div className="space-y-2">
                {data.topPages.map((page) => (
                  <div
                    key={page.path}
                    className="flex items-center justify-between text-xs py-1 border-b border-zinc-800/40 last:border-0"
                  >
                    <span className="text-zinc-300 truncate max-w-[160px] font-mono">
                      {page.path === "/" ? "Home (Root)" : page.path}
                    </span>
                    <span className="text-zinc-400 font-semibold">{page.views}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Referrers */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
                Referral Channels
              </h3>
              <div className="space-y-3">
                {data.referrers.map((ref) => (
                  <div key={ref.category} className="space-y-1">
                    <div className="flex justify-between text-xs text-zinc-300">
                      <span className="capitalize">{ref.category}</span>
                      <span className="text-zinc-400">
                        {ref.count} ({ref.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${ref.percentage}%` }}
                        className="h-full bg-blue-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
              <h3 className="text-xs font-semibold text-zinc-200 uppercase tracking-wider mb-3">
                Devices
              </h3>
              <div className="space-y-3">
                {data.devices.map((dev) => (
                  <div key={dev.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-zinc-300">
                      <span className="capitalize flex items-center gap-1.5">
                        {dev.category === "mobile" ? (
                          <Smartphone className="w-3.5 h-3.5 text-zinc-400" />
                        ) : dev.category === "tablet" ? (
                          <Laptop className="w-3.5 h-3.5 text-zinc-400" />
                        ) : (
                          <Monitor className="w-3.5 h-3.5 text-zinc-400" />
                        )}
                        {dev.category}
                      </span>
                      <span className="text-zinc-400">
                        {dev.count} ({dev.percentage}%)
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${dev.percentage}%` }}
                        className="h-full bg-emerald-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Retention Notice & Pro Upgrade */}
          {data.effectiveDays < (range === "90d" ? 90 : range === "30d" ? 30 : 7) && (
            <div className="bg-zinc-900/80 border border-blue-900/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="text-xs text-zinc-300">
                <span className="font-semibold text-white">Free Plan Notice:</span> Analytics are
                currently limited to {data.effectiveDays} days of retention. Upgrade to Pro for 365
                days of continuous historical data and full campaign breakdowns.
              </div>
              {onUpgradeClick && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onUpgradeClick}
                  className="shrink-0 h-8 text-xs border-blue-600 text-blue-400 hover:bg-blue-950/40"
                >
                  Upgrade to Pro <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
