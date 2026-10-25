"use client";

import React, { useState } from "react";
import { ContactConfig } from "@/lib/schema/portfolio";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ContactInboxModal } from "@/components/contact/contact-inbox-modal";
import { Mail, Inbox, ShieldCheck } from "lucide-react";

interface ContactConfigFormProps {
  portfolioId: string;
  config: ContactConfig;
  onChange: (updated: ContactConfig) => void;
  defaultEmail?: string;
}

export function ContactConfigForm({
  portfolioId,
  config,
  onChange,
  defaultEmail = "",
}: ContactConfigFormProps) {
  const [isInboxOpen, setIsInboxOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <div>
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-blue-400" />
            Visitor Contact Form
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Allow visitors to send messages directly from your published portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsInboxOpen(true)}
            className="h-8 text-xs border-zinc-800 text-zinc-300 hover:text-white"
          >
            <Inbox className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            Open Inbox
          </Button>

          <Switch
            checked={config.enabled}
            onCheckedChange={(checked) => onChange({ ...config, enabled: checked })}
          />
        </div>
      </div>

      {config.enabled && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Section Title</label>
            <Input
              type="text"
              value={config.title}
              onChange={(e) => onChange({ ...config, title: e.target.value })}
              placeholder="Get in Touch"
              className="text-xs bg-zinc-900 border-zinc-800 text-white"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">Introductory Text</label>
            <Textarea
              rows={2}
              value={config.description}
              onChange={(e) => onChange({ ...config, description: e.target.value })}
              placeholder="Have a question or collaboration in mind? Send a message directly."
              className="text-xs bg-zinc-900 border-zinc-800 text-white resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-zinc-300">
              Forward Submissions To (Email)
            </label>
            <Input
              type="email"
              value={config.recipientEmail}
              onChange={(e) => onChange({ ...config, recipientEmail: e.target.value })}
              placeholder={defaultEmail || "your-email@example.com"}
              className="text-xs bg-zinc-900 border-zinc-800 text-white"
            />
            <p className="text-[11px] text-zinc-500">
              Leave blank to route messages to your profile email. Submissions are always securely stored in your Portfolify inbox.
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-zinc-800/80">
            <div>
              <span className="text-xs font-medium text-zinc-300">Require Subject Field</span>
              <p className="text-[11px] text-zinc-500">
                Ask visitors to provide a topic or subject line before sending.
              </p>
            </div>
            <Switch
              checked={config.requireSubject}
              onCheckedChange={(checked) => onChange({ ...config, requireSubject: checked })}
            />
          </div>

          <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800/80 text-[11px] text-zinc-400 flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Built-in spam honeypot filters and rate-limiting active on public forms.</span>
          </div>
        </div>
      )}

      {isInboxOpen && (
        <ContactInboxModal
          isOpen={isInboxOpen}
          onClose={() => setIsInboxOpen(false)}
          portfolioId={portfolioId}
        />
      )}
    </div>
  );
}
