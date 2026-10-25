import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, AlertCircle, Check, X, KeyRound } from "lucide-react";
import { PortfolioData } from "@/lib/schema/portfolio";

interface AiAssistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySuggestions: (extracted: Partial<PortfolioData>) => void;
}

export function AiAssistModal({ isOpen, onClose, onApplySuggestions }: AiAssistModalProps) {
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMissingKey, setIsMissingKey] = useState(false);
  const [previewData, setPreviewData] = useState<Partial<PortfolioData> | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError(null);
    setIsMissingKey(false);
    setPreviewData(null);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ facts: prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.code === "MISSING_API_KEY") {
          setIsMissingKey(true);
          setError("Server is missing GEMINI_API_KEY. Configure it in .env.local to enable real AI generation.");
        } else {
          setError(data.error || "Failed to process information.");
        }
        return;
      }

      setPreviewData(data.data);
    } catch {
      setError("Network or server connection failed. Please verify the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (previewData) {
      onApplySuggestions(previewData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-xl w-full p-6 text-zinc-100 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950/60 border border-blue-800/80 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">AI Portfolio Assistant</h3>
              <p className="text-xs text-zinc-400">
                Grounds generation strictly in facts you provide.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input prompt */}
        {!previewData && (
          <div className="space-y-3">
            <label className="text-xs font-medium text-zinc-300 block">
              Provide your background, roles, projects, or achievements:
            </label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. I am a Senior Frontend Engineer with 7 years experience at Vercel and Figma. I built a real-time collaborative canvas using WebAssembly and WebSockets. Core skills: TypeScript, React, Rust, Next.js. Graduated with BS in CS from UC Berkeley in 2017."
              rows={5}
              className="text-xs font-sans leading-relaxed"
            />
            <p className="text-[11px] text-zinc-500">
              Per strict anti-hallucination rules, Portfolify will only structure facts you explicitly provide.
            </p>

            {error && (
              <div className="p-3 rounded-lg border border-amber-900/40 bg-amber-950/20 text-xs text-amber-300 flex items-start gap-2.5">
                {isMissingKey ? <KeyRound className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />}
                <div className="space-y-1">
                  <p>{error}</p>
                  {isMissingKey && (
                    <p className="text-[11px] text-zinc-400">
                      Add <code className="text-zinc-200">GEMINI_API_KEY=&quot;your_key&quot;</code> to your <code className="text-zinc-200">.env.local</code> file and restart the dev server.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preview Extracted Data */}
        {previewData && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-lg">
              <Check className="w-4 h-4" />
              <span>Structured content extracted. Review below before applying to your portfolio.</span>
            </div>

            <div className="max-h-60 overflow-y-auto p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 text-xs space-y-2 font-mono text-zinc-300">
              {previewData.profile?.fullName && (
                <p><strong className="text-zinc-100">Name:</strong> {previewData.profile.fullName}</p>
              )}
              {previewData.profile?.headline && (
                <p><strong className="text-zinc-100">Headline:</strong> {previewData.profile.headline}</p>
              )}
              {previewData.profile?.bio && (
                <p><strong className="text-zinc-100">Bio:</strong> {previewData.profile.bio}</p>
              )}
              {previewData.skills && previewData.skills.length > 0 && (
                <p><strong className="text-zinc-100">Skills ({previewData.skills.length}):</strong> {previewData.skills.map((s) => s.name).join(", ")}</p>
              )}
              {previewData.projects && previewData.projects.length > 0 && (
                <p><strong className="text-zinc-100">Projects ({previewData.projects.length}):</strong> {previewData.projects.map((p) => p.title).join(", ")}</p>
              )}
              {previewData.experience && previewData.experience.length > 0 && (
                <p><strong className="text-zinc-100">Experience ({previewData.experience.length}):</strong> {previewData.experience.map((e) => `${e.role} @ ${e.company}`).join(", ")}</p>
              )}
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          {!previewData ? (
            <Button
              variant="brand"
              size="sm"
              onClick={handleGenerate}
              isLoading={isLoading}
              disabled={!prompt.trim()}
              className="gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Generate Grounded Portfolio
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewData(null)}
              >
                Back to Edit
              </Button>
              <Button
                variant="brand"
                size="sm"
                onClick={handleApply}
                className="gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                Apply to Portfolio
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
