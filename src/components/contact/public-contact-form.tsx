"use client";

import React, { useState } from "react";
import { ContactConfig } from "@/lib/schema/portfolio";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface PublicContactFormProps {
  portfolioId: string;
  config?: ContactConfig;
  isLivePreview?: boolean;
}

export function PublicContactForm({
  portfolioId,
  config,
  isLivePreview = false,
}: PublicContactFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState(""); // hidden honeypot for spam bots

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (config && !config.enabled) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLivePreview) {
      alert("In live preview: Message submission is active on your published portfolio.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject: subject || undefined,
          message,
          website: honeypot, // honeypot
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to send message.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error sending message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto rounded-2xl bg-zinc-950/70 border border-zinc-800/80 p-6 sm:p-8 backdrop-blur-sm">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-white tracking-tight">
          {config?.title || "Get in Touch"}
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
          {config?.description ||
            "Have a question, opportunity, or collaboration in mind? Send a message directly."}
        </p>
      </div>

      {isLivePreview && (
        <div className="mb-4 text-[11px] bg-blue-950/40 border border-blue-800/50 rounded-lg p-2.5 text-blue-300">
          Editor Preview: Submissions are delivered to your Portfolify inbox once published.
        </div>
      )}

      {success ? (
        <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-xl p-6 text-center space-y-3">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-semibold text-white">Message Delivered</h4>
          <p className="text-xs text-zinc-300">
            Thank you for reaching out! Your message has been safely delivered to the portfolio owner.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSuccess(false)}
            className="mt-2 text-xs border-zinc-800 text-zinc-300"
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-950/40 border border-red-800/60 rounded-lg p-3 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Honeypot field (hidden from visual visitors) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="sender-name" className="text-xs font-medium text-zinc-300">
                Your Name <span className="text-red-400">*</span>
              </label>
              <Input
                id="sender-name"
                type="text"
                required
                maxLength={100}
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="sender-email" className="text-xs font-medium text-zinc-300">
                Your Email <span className="text-red-400">*</span>
              </label>
              <Input
                id="sender-email"
                type="email"
                required
                maxLength={100}
                placeholder="jane@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 text-xs"
              />
            </div>
          </div>

          {config?.requireSubject && (
            <div className="space-y-1.5">
              <label htmlFor="sender-subject" className="text-xs font-medium text-zinc-300">
                Subject
              </label>
              <Input
                id="sender-subject"
                type="text"
                maxLength={150}
                placeholder="Collaboration opportunity..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 text-xs"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="sender-message" className="text-xs font-medium text-zinc-300">
              Message <span className="text-red-400">*</span>
            </label>
            <Textarea
              id="sender-message"
              required
              rows={4}
              maxLength={3000}
              placeholder="Hi, I saw your work on..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-600 text-xs resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs h-9 transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Sending Message...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Send Message</span>
              </>
            )}
          </Button>

          <p className="text-[10px] text-zinc-500 text-center">
            Messages are delivered directly to the portfolio owner. No promotional spam.
          </p>
        </form>
      )}
    </div>
  );
}
