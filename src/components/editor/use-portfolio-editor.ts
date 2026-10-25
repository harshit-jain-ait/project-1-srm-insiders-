"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  PortfolioData,
  initializePortfolioWithTemplate,
  validatePublishReadiness,
  TemplateId,
} from "@/lib/schema/portfolio";

export type SaveStatus = "saved" | "saving" | "unsaved" | "error";

interface UsePortfolioEditorOptions {
  portfolioId: string | null;
  templateParam: TemplateId | null;
}

const MAX_HISTORY_LENGTH = 30;

export function usePortfolioEditor({ portfolioId, templateParam }: UsePortfolioEditorOptions) {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Undo / Redo History Stacks
  const [history, setHistory] = useState<PortfolioData[]>([]);
  const [future, setFuture] = useState<PortfolioData[]>([]);

  // Refs to prevent stale async save closures
  const portfolioRef = useRef<PortfolioData | null>(null);
  const isSavingRef = useRef(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedJsonRef = useRef<string>("");

  useEffect(() => {
    portfolioRef.current = portfolio;
  }, [portfolio]);

  // 1. Initial Load / Creation
  useEffect(() => {
    async function loadPortfolio() {
      if (portfolioId) {
        try {
          const claimToken =
            typeof window !== "undefined"
              ? localStorage.getItem(`portfolify_claim_${portfolioId}`)
              : null;
          const headers: Record<string, string> = {};
          if (claimToken) headers["x-draft-claim-token"] = claimToken;

          const res = await fetch(`/api/portfolios/${portfolioId}`, { headers });
          if (res.ok) {
            const data = await res.json();
            if (data.success && data.data) {
              setPortfolio(data.data);
              lastSavedJsonRef.current = JSON.stringify(data.data);
              setSaveStatus("saved");
              return;
            }
          }
        } catch (err) {
          console.error("Failed to fetch existing portfolio:", err);
        }
      }

      // Initialize clean portfolio from verified template
      const empty = initializePortfolioWithTemplate(templateParam || "minimal-portfolio");
      setPortfolio(empty);
      lastSavedJsonRef.current = JSON.stringify(empty);
      setSaveStatus("saved");
    }

    loadPortfolio();
  }, [portfolioId, templateParam]);

  // 2. Perform Save Operation
  const persistToServer = useCallback(async (dataToSave: PortfolioData): Promise<boolean> => {
    if (isSavingRef.current) return false;
    isSavingRef.current = true;
    setSaveStatus("saving");

    try {
      const claimToken =
        typeof window !== "undefined" && dataToSave.id
          ? localStorage.getItem(`portfolify_claim_${dataToSave.id}`)
          : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (claimToken) headers["x-draft-claim-token"] = claimToken;

      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers,
        body: JSON.stringify(dataToSave),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        // Store claim token locally for future requests
        if (result.claimToken && typeof window !== "undefined") {
          localStorage.setItem(`portfolify_claim_${result.data.id}`, result.claimToken);
        }

        // Update the revision number without destroying newer local keystrokes
        setPortfolio((curr) => {
          if (!curr) return curr;
          return {
            ...curr,
            revision: result.data.revision,
            updatedAt: result.data.updatedAt,
          };
        });

        lastSavedJsonRef.current = JSON.stringify({
          ...dataToSave,
          revision: result.data.revision,
          updatedAt: result.data.updatedAt,
        });

        setSaveStatus("saved");
        setLastSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
        return true;
      } else if (res.status === 409) {
        setSaveStatus("error");
        setFeedbackMessage("Conflict: Portfolio was modified elsewhere. Your local edits are preserved.");
        return false;
      } else {
        setSaveStatus("error");
        setFeedbackMessage(result.error || "Failed to save portfolio");
        return false;
      }
    } catch {
      setSaveStatus("error");
      setFeedbackMessage("Network failure during save");
      return false;
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  // 3. State Update with History Tracking & Debounced Autosave
  const updatePortfolio = useCallback(
    (updater: PortfolioData | ((prev: PortfolioData) => PortfolioData), trackHistory = true) => {
      setPortfolio((prev) => {
        if (!prev) return prev;
        const next = typeof updater === "function" ? updater(prev) : updater;

        // Skip if identical JSON
        const prevJson = JSON.stringify(prev);
        const nextJson = JSON.stringify(next);
        if (prevJson === nextJson) return prev;

        // Push to undo stack
        if (trackHistory) {
          setHistory((h) => [...h.slice(-(MAX_HISTORY_LENGTH - 1)), prev]);
          setFuture([]); // Clear redo stack on new action
        }

        // Compare against last saved state
        if (nextJson !== lastSavedJsonRef.current) {
          setSaveStatus("unsaved");

          // Schedule debounced autosave (2000ms)
          if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
          }
          debounceTimerRef.current = setTimeout(() => {
            if (portfolioRef.current) {
              persistToServer(portfolioRef.current);
            }
          }, 2000);
        } else {
          setSaveStatus("saved");
        }

        return next;
      });
    },
    [persistToServer]
  );

  // 4. Undo Handler
  const undo = useCallback(() => {
    if (history.length === 0 || !portfolio) return;
    const previous = history[history.length - 1];
    const newHistory = history.slice(0, -1);

    setFuture((f) => [portfolio, ...f]);
    setHistory(newHistory);
    updatePortfolio(previous, false);
  }, [history, portfolio, updatePortfolio]);

  // 5. Redo Handler
  const redo = useCallback(() => {
    if (future.length === 0 || !portfolio) return;
    const next = future[0];
    const newFuture = future.slice(1);

    setHistory((h) => [...h, portfolio]);
    setFuture(newFuture);
    updatePortfolio(next, false);
  }, [future, portfolio, updatePortfolio]);

  // 6. Global Keyboard Shortcuts (Cmd+Z, Cmd+Shift+Z, Cmd+Y)
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Don't intercept undo/redo inside standard text inputs or textareas
      const target = e.target as HTMLElement;
      const isInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        if (!isInput) {
          e.preventDefault();
          if (e.shiftKey) {
            redo();
          } else {
            undo();
          }
        }
      } else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "y") {
        if (!isInput) {
          e.preventDefault();
          redo();
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // 7. Unsaved Changes Warning Before Navigation
  useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (saveStatus === "unsaved") {
        e.preventDefault();
        e.returnValue = "";
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [saveStatus]);

  // Clean up debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, []);

  // 8. Manual Immediate Save Action
  const manualSave = useCallback(async () => {
    if (!portfolioRef.current) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    const success = await persistToServer(portfolioRef.current);
    if (success) {
      setFeedbackMessage("Draft saved successfully");
      setTimeout(() => setFeedbackMessage(null), 3000);
    }
  }, [persistToServer]);

  // 9. Publish Toggle Action
  const togglePublish = useCallback(async () => {
    if (!portfolioRef.current) return;
    const current = portfolioRef.current;
    const action = current.published ? "unpublish" : "publish";

    if (action === "publish") {
      const readiness = validatePublishReadiness(current);
      if (!readiness.isReady) {
        setFeedbackMessage(`Cannot publish: ${readiness.errors[0]}`);
        setTimeout(() => setFeedbackMessage(null), 5000);
        return;
      }
    }

    // First ensure draft is saved
    const saved = await persistToServer(current);
    if (!saved) return;

    try {
      const claimToken =
        typeof window !== "undefined"
          ? localStorage.getItem(`portfolify_claim_${current.id}`)
          : null;
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (claimToken) headers["x-draft-claim-token"] = claimToken;

      const res = await fetch(`/api/portfolios/${current.id}/publish`, {
        method: "POST",
        headers,
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        updatePortfolio(
          (prev) => ({
            ...prev,
            published: data.data.published,
            publishedAt: data.data.publishedAt,
          }),
          false
        );
        setFeedbackMessage(
          data.data.published
            ? `Portfolio published live at /p/${current.slug}`
            : "Portfolio unpublished"
        );
        setTimeout(() => setFeedbackMessage(null), 4000);
      } else {
        setFeedbackMessage(data.error || "Failed to update publishing state");
      }
    } catch {
      setFeedbackMessage("Network error during publish request");
    }
  }, [persistToServer, updatePortfolio]);

  return {
    portfolio,
    updatePortfolio,
    saveStatus,
    lastSavedAt,
    manualSave,
    togglePublish,
    feedbackMessage,
    setFeedbackMessage,
    canUndo: history.length > 0,
    canRedo: future.length > 0,
    undo,
    redo,
  };
}
