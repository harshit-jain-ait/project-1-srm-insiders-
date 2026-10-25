"use client";

import React, { useState } from "react";
import { CustomDomainConfig } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormLabel, FormHelperText } from "@/components/ui/form-field";
import {
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface CustomDomainFormProps {
  portfolioId: string;
  customDomain?: CustomDomainConfig;
  onDomainChange: (config: CustomDomainConfig) => void;
}

export function CustomDomainForm({
  portfolioId,
  customDomain,
  onDomainChange,
}: CustomDomainFormProps) {
  const [domainInput, setDomainInput] = useState(customDomain?.domain || "");
  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const status = customDomain?.status || "none";
  const hasDomain = Boolean(customDomain?.domain);

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(key);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleConnectDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainInput.trim()) return;

    setIsConnecting(true);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "configure",
          domain: domainInput.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setErrorMessage(data.error || "Failed to configure custom domain.");
      } else {
        onDomainChange(data.data);
        setFeedbackMessage(data.message || "Domain configured! Add the DNS records below to verify.");
      }
    } catch {
      setErrorMessage("Network error while configuring custom domain.");
    } finally {
      setIsConnecting(false);
    }
  };

  const handleVerifyDns = async () => {
    setIsVerifying(true);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify" }),
      });

      const data = await res.json();
      if (data.data) {
        onDomainChange(data.data);
      }

      if (data.success) {
        setFeedbackMessage(data.explanation || "Domain ownership verified! Domain is active.");
      } else {
        setErrorMessage(data.error || data.explanation || "DNS record could not be verified yet.");
      }
    } catch {
      setErrorMessage("Network error while querying DNS records.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleRemoveDomain = async () => {
    if (!confirm("Are you sure you want to disconnect this custom domain?")) return;

    setIsRemoving(true);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      const res = await fetch(`/api/portfolios/${portfolioId}/domain`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "remove" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        onDomainChange(data.data);
        setDomainInput("");
        setFeedbackMessage("Custom domain removed.");
      } else {
        setErrorMessage(data.error || "Failed to remove custom domain.");
      }
    } catch {
      setErrorMessage("Network error while removing domain.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-blue-400" />
          <span>Custom Domain Connection</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Connect your personal domain (e.g., `alexrivera.dev`) to serve your published portfolio.
        </p>
      </div>

      {/* Domain Input Form */}
      {!hasDomain ? (
        <form onSubmit={handleConnectDomain} className="space-y-3">
          <div>
            <FormLabel htmlFor="custom-domain-input">Your Custom Domain</FormLabel>
            <div className="flex items-center gap-2 mt-1">
              <Input
                id="custom-domain-input"
                value={domainInput}
                onChange={(e) => setDomainInput(e.target.value)}
                placeholder="e.g. alexrivera.com"
                className="font-mono text-xs"
              />
              <Button
                type="submit"
                variant="brand"
                size="sm"
                isLoading={isConnecting}
                disabled={!domainInput.trim()}
                className="shrink-0"
              >
                Connect Domain
              </Button>
            </div>
            <FormHelperText>
              Enter the domain without `https://` or trailing slashes. Both root domains and subdomains are supported.
            </FormHelperText>
          </div>
        </form>
      ) : (
        /* Connected Domain Status Box */
        <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/60 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div
                className={`h-8 w-8 rounded-lg flex items-center justify-center ${
                  status === "active" || status === "verified"
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : status === "failed"
                    ? "bg-red-500/10 text-red-400 border border-red-500/20"
                    : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                }`}
              >
                {status === "active" || status === "verified" ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : status === "failed" ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-white font-mono">
                    {customDomain?.domain}
                  </span>
                  {status === "active" && (
                    <a
                      href={`https://${customDomain?.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-500 hover:text-blue-400"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <div className="text-xs">
                  {status === "active" || status === "verified" ? (
                    <span className="text-emerald-400 font-medium">Domain Active & Verified</span>
                  ) : status === "failed" ? (
                    <span className="text-red-400 font-medium">Verification Failed</span>
                  ) : (
                    <span className="text-amber-400 font-medium">Awaiting DNS Configuration</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleVerifyDns}
                isLoading={isVerifying}
                className="h-8 text-xs border-zinc-700"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Check DNS
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleRemoveDomain}
                isLoading={isRemoving}
                className="h-8 w-8 text-zinc-500 hover:text-red-400"
                title="Disconnect domain"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* DNS Configuration Table */}
          {status !== "active" && (
            <div className="space-y-3 pt-2 border-t border-zinc-800">
              <span className="text-xs font-semibold text-zinc-300">
                Required DNS Configuration
              </span>
              <p className="text-[11px] text-zinc-400">
                Log into your domain registrar (Cloudflare, Namecheap, GoDaddy, etc.) and add the following two DNS records:
              </p>

              {/* Record 1: Verification TXT */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-sans font-medium text-zinc-300">1. Verification Record (TXT)</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "txt",
                        customDomain?.dnsRecords?.verificationRecord.value ||
                          customDomain?.verificationToken ||
                          ""
                      )
                    }
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    {copiedField === "txt" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Value</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-zinc-300 border-t border-zinc-850">
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-sans">TYPE</span>
                    TXT
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-sans">HOST / NAME</span>
                    _portfolify-challenge
                  </div>
                  <div className="truncate">
                    <span className="text-zinc-500 block text-[9px] font-sans">VALUE</span>
                    {customDomain?.dnsRecords?.verificationRecord.value ||
                      customDomain?.verificationToken}
                  </div>
                </div>
              </div>

              {/* Record 2: Routing CNAME */}
              <div className="p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 font-mono text-[11px] space-y-1">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="font-sans font-medium text-zinc-300">2. Routing Target (CNAME)</span>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        "cname",
                        customDomain?.dnsRecords?.cnameRecord.value || "cname.portfolify.com"
                      )
                    }
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 cursor-pointer"
                  >
                    {copiedField === "cname" ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Value</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-zinc-300 border-t border-zinc-850">
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-sans">TYPE</span>
                    CNAME
                  </div>
                  <div>
                    <span className="text-zinc-500 block text-[9px] font-sans">HOST / NAME</span>
                    @ or www
                  </div>
                  <div className="truncate">
                    <span className="text-zinc-500 block text-[9px] font-sans">VALUE</span>
                    {customDomain?.dnsRecords?.cnameRecord.value || "cname.portfolify.com"}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Feedback & Error Banners */}
      {feedbackMessage && (
        <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 text-xs text-emerald-200 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
}
