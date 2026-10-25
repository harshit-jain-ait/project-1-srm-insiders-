"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ContactSubmissionRecord } from "@/lib/contact/contact-service";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  Mail,
  MailOpen,
  Archive,
  Trash2,
  X,
  ExternalLink,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

interface ContactInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioId: string;
}

export function ContactInboxModal({
  isOpen,
  onClose,
  portfolioId,
}: ContactInboxModalProps) {
  const [messages, setMessages] = useState<ContactSubmissionRecord[]>([]);
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url =
        filter === "all"
          ? `/api/portfolios/${portfolioId}/contact`
          : `/api/portfolios/${portfolioId}/contact?status=${filter}`;
      const res = await fetch(url);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to load messages");
      }
      setMessages(json.data);
      if (json.data.length > 0 && !activeMessageId) {
        setActiveMessageId(json.data[0].id);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error connecting to inbox");
    } finally {
      setLoading(false);
    }
  }, [portfolioId, filter, activeMessageId]);

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;
    const url =
      filter === "all"
        ? `/api/portfolios/${portfolioId}/contact`
        : `/api/portfolios/${portfolioId}/contact?status=${filter}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (!isMounted) return;
        if (!json.success) throw new Error(json.error || "Failed to load messages");
        setMessages(json.data);
        if (json.data.length > 0 && !activeMessageId) {
          setActiveMessageId(json.data[0].id);
        }
      })
      .catch((err: unknown) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : "Error connecting to inbox");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, portfolioId, filter, activeMessageId]);

  if (!isOpen) return null;

  const handleUpdateStatus = async (id: string, newStatus: "unread" | "read" | "archived") => {
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/contact/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m))
        );
      }
    } catch {
      // Ignore
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/contact/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
        if (activeMessageId === id) {
          const remaining = messages.filter((m) => m.id !== id);
          setActiveMessageId(remaining.length > 0 ? remaining[0].id : null);
        }
      }
    } catch {
      // Ignore
    }
  };

  const activeMessage = messages.find((m) => m.id === activeMessageId);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-4xl h-[640px] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Inbox className="w-5 h-5 text-blue-500" />
            <h2 className="text-base font-semibold text-white">Visitor Messages Inbox</h2>
            <span className="text-xs text-zinc-500 ml-2">
              ({messages.length} {messages.length === 1 ? "message" : "messages"})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={fetchMessages}
              disabled={loading}
              className="h-8 text-xs text-zinc-400 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {error && (
          <div className="px-6 py-2 bg-red-950/60 border-b border-red-900/50 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Filter Pills */}
        <div className="px-6 py-2.5 bg-zinc-900/60 border-b border-zinc-800 flex items-center gap-2">
          {(["all", "unread", "archived"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition-colors ${
                filter === t
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Body Split */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Message List */}
          <div className="w-2/5 border-r border-zinc-800 overflow-y-auto divide-y divide-zinc-850">
            {loading && messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">
                <Inbox className="w-8 h-8 mx-auto mb-2 text-zinc-600" />
                No messages found in this view.
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setActiveMessageId(msg.id);
                    if (msg.status === "unread") {
                      handleUpdateStatus(msg.id, "read");
                    }
                  }}
                  className={`p-4 cursor-pointer transition-colors ${
                    activeMessageId === msg.id
                      ? "bg-zinc-900/90 text-white"
                      : "hover:bg-zinc-900/40 text-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-xs text-white truncate max-w-[140px]">
                      {msg.name}
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-zinc-200 truncate mb-1">
                    {msg.subject || "No subject"}
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {msg.message}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={`text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded ${
                        msg.status === "unread"
                          ? "bg-blue-950 text-blue-400 border border-blue-800/60"
                          : msg.status === "archived"
                          ? "bg-zinc-900 text-zinc-500"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right: Selected Message Content */}
          <div className="w-3/5 p-6 overflow-y-auto flex flex-col justify-between">
            {activeMessage ? (
              <div className="space-y-6">
                {/* Actions Toolbar */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                  <div className="flex items-center gap-2">
                    {activeMessage.status === "unread" ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(activeMessage.id, "read")}
                        className="h-7 text-xs border-zinc-800 text-zinc-300"
                      >
                        <MailOpen className="w-3.5 h-3.5 mr-1" /> Mark Read
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(activeMessage.id, "unread")}
                        className="h-7 text-xs border-zinc-800 text-zinc-300"
                      >
                        <Mail className="w-3.5 h-3.5 mr-1" /> Mark Unread
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleUpdateStatus(
                          activeMessage.id,
                          activeMessage.status === "archived" ? "read" : "archived"
                        )
                      }
                      className="h-7 text-xs border-zinc-800 text-zinc-300"
                    >
                      <Archive className="w-3.5 h-3.5 mr-1" />
                      {activeMessage.status === "archived" ? "Unarchive" : "Archive"}
                    </Button>
                  </div>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(activeMessage.id)}
                    className="h-7 text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30"
                  >
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>

                {/* Sender Metadata */}
                <div>
                  <h3 className="text-base font-semibold text-white mb-1">
                    {activeMessage.subject || "Message from Visitor"}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-zinc-400">
                    <span className="font-medium text-zinc-200">{activeMessage.name}</span>
                    <span>&bull;</span>
                    <a
                      href={`mailto:${activeMessage.email}`}
                      className="text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {activeMessage.email} <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 mt-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{new Date(activeMessage.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5 text-xs text-zinc-200 leading-relaxed whitespace-pre-wrap">
                  {activeMessage.message}
                </div>

                {/* Direct Reply Button */}
                <div className="pt-4 border-t border-zinc-800">
                  <a
                    href={`mailto:${activeMessage.email}?subject=${encodeURIComponent(
                      `Re: ${activeMessage.subject || "Your message on Portfolify"}`
                    )}`}
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-lg transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Reply via Email ({activeMessage.email})
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-xs text-zinc-500">
                Select a message on the left to read full content.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
