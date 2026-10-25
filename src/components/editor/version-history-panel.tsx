"use client";

import React, { useState, useEffect, useCallback } from "react";
import { SnapshotMetadata } from "@/lib/services/version-history-service";
import { PortfolioData } from "@/lib/schema/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  History,
  RotateCcw,
  Plus,
  Clock,
  ShieldCheck,
  X,
  AlertTriangle,
  RefreshCw,
  ArrowUpRight,
} from "lucide-react";

interface VersionHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
  currentRevision?: number;
  onRestore: (restored: PortfolioData) => void;
  onUpgradeClick?: () => void;
}

export function VersionHistoryPanel({
  isOpen,
  onClose,
  portfolioId,
  currentRevision = 1,
  onRestore,
  onUpgradeClick,
}: VersionHistoryPanelProps) {
  const [snapshots, setSnapshots] = useState<SnapshotMetadata[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newLabel, setNewLabel] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchVersions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/versions`);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load versions");
      }
      setSnapshots(json.data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error connecting to version service");
    } finally {
      setLoading(false);
    }
  }, [portfolioId]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    fetch(`/api/portfolios/${portfolioId}/versions`)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (!json.success) throw new Error(json.error || "Failed to load versions");
        setSnapshots(json.data);
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Error connecting to version service");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, portfolioId]);

  if (!isOpen) return null;

  const handleCreateSnapshot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: newLabel.trim() || undefined }),
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create checkpoint");
      }
      setNewLabel("");
      fetchVersions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating checkpoint");
    } finally {
      setIsCreating(false);
    }
  };

  const handleExecuteRestore = async (versionId: string) => {
    setIsRestoring(true);
    setError(null);
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/versions/${versionId}/restore`, {
        method: "POST",
      });
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to restore version");
      }
      onRestore(json.data);
      setConfirmRestoreId(null);
      fetchVersions();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to restore version");
    } finally {
      setIsRestoring(false);
    }
  };

  const targetConfirmSnapshot = snapshots.find((s) => s.id === confirmRestoreId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-blue-500" />
            <div>
              <h2 className="text-base font-semibold text-white">Version History & Recovery</h2>
              <p className="text-xs text-zinc-400">Current working draft: Revision #{currentRevision}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Create Manual Checkpoint Form */}
        <form onSubmit={handleCreateSnapshot} className="px-6 py-3 bg-zinc-900/60 border-b border-zinc-800 flex gap-2">
          <Input
            type="text"
            placeholder="Label this version (e.g. 'Before hero rewrite')..."
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            className="text-xs bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600 h-8"
          />
          <Button
            type="submit"
            disabled={isCreating}
            size="sm"
            className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            {isCreating ? "Saving..." : "Save Checkpoint"}
          </Button>
        </form>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Confirmation Modal Overlay for Restore */}
        {confirmRestoreId && targetConfirmSnapshot && (
          <div className="p-6 bg-zinc-900/90 border-b border-amber-900/40 space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Restore to Revision #{targetConfirmSnapshot.revision}?
                </h4>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Restoring will replace your current editor draft with this saved version. An automatic pre-restore backup checkpoint will be captured immediately so your current draft is safely preserved.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirmRestoreId(null)}
                className="h-8 text-xs border-zinc-700 text-zinc-300"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={isRestoring}
                onClick={() => handleExecuteRestore(confirmRestoreId)}
                className="h-8 text-xs bg-amber-600 hover:bg-amber-500 text-white"
              >
                <RotateCcw className={`w-3.5 h-3.5 mr-1 ${isRestoring ? "animate-spin" : ""}`} />
                {isRestoring ? "Restoring..." : "Confirm & Restore"}
              </Button>
            </div>
          </div>
        )}

        {/* Versions Timeline List */}
        <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-zinc-850">
          {loading && snapshots.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500">
              <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-zinc-600" />
              Loading saved versions...
            </div>
          ) : snapshots.length === 0 ? (
            <div className="py-12 text-center text-xs text-zinc-500 space-y-2">
              <History className="w-8 h-8 mx-auto text-zinc-700" />
              <p>No saved versions yet.</p>
              <p className="text-[11px] text-zinc-600">
                Checkpoints are created automatically before major AI operations, template switches, and when you save manually.
              </p>
            </div>
          ) : (
            snapshots.map((snap) => {
              const triggerStyles: Record<string, string> = {
                manual: "text-blue-400 bg-blue-950/60 border-blue-800/60",
                pre_ai: "text-purple-400 bg-purple-950/60 border-purple-800/60",
                template_switch: "text-amber-400 bg-amber-950/60 border-amber-800/60",
                pre_restore: "text-zinc-400 bg-zinc-900 border-zinc-800",
                publish: "text-emerald-400 bg-emerald-950/60 border-emerald-800/60",
              };

              return (
                <div key={snap.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-semibold text-white">
                        Rev #{snap.revision}
                      </span>
                      <span
                        className={`text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded border ${
                          triggerStyles[snap.trigger] || "text-zinc-400 bg-zinc-900"
                        }`}
                      >
                        {snap.trigger.replace("_", " ")}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        template:{snap.templateId}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 font-medium">{snap.label}</p>

                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(snap.createdAt).toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setConfirmRestoreId(snap.id)}
                    className="h-7 text-xs border-zinc-800 text-zinc-300 hover:text-white shrink-0"
                  >
                    <RotateCcw className="w-3 h-3 mr-1" /> Restore
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-zinc-900/60 border-t border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Automatic pre-restore checkpoint protection</span>
          </div>

          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Pro history quota <ArrowUpRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
