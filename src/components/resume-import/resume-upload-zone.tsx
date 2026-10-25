"use client";

import React, { useState, useRef } from "react";
import { RESUME_UPLOAD_LIMITS, ResumeErrorCode } from "@/lib/resume-import/types";
import { UploadCloud, FileText, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumeUploadZoneProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  errorCode?: ResumeErrorCode | null;
  errorMessage?: string | null;
}

export function ResumeUploadZone({
  onFileSelect,
  isProcessing,
  errorCode,
  errorMessage,
}: ResumeUploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndDispatch = (file: File) => {
    setClientError(null);

    // 1. Size check
    if (file.size > RESUME_UPLOAD_LIMITS.maxSizeBytes) {
      setClientError(
        `File is too large (${(file.size / (1024 * 1024)).toFixed(1)} MB). Maximum allowed size is ${RESUME_UPLOAD_LIMITS.maxSizeFormatted}.`
      );
      return;
    }

    // 2. Extension check
    const lowerName = file.name.toLowerCase();
    const isAllowed = RESUME_UPLOAD_LIMITS.allowedExtensions.some((ext) => lowerName.endsWith(ext));
    if (!isAllowed) {
      setClientError("Unsupported file type. Please upload a PDF (.pdf), Word document (.docx), or text file (.txt).");
      return;
    }

    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndDispatch(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndDispatch(file);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4 font-sans">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !isProcessing) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload resume file dropzone"
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 ${
          isDragOver
            ? "border-blue-500 bg-blue-950/20"
            : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700 hover:bg-zinc-900/60"
        } ${isProcessing ? "opacity-60 cursor-not-allowed pointer-events-none" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          onChange={handleInputChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-blue-400 shadow-sm">
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>

          <div className="space-y-1.5">
            <p className="text-base font-semibold text-white">
              {isProcessing ? "Analyzing Resume Document..." : "Drop your resume here, or click to browse"}
            </p>
            <p className="text-xs text-zinc-400">
              Supports PDF (.pdf), Word (.docx), and plain text (.txt, .md) up to {RESUME_UPLOAD_LIMITS.maxSizeFormatted}
            </p>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isProcessing}
              className="border-zinc-700 text-zinc-200 pointer-events-none"
            >
              <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
              <span>Select Document</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Security and privacy reassurance note */}
      <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-[11px] text-zinc-400 flex items-start gap-2.5">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1" />
        <p className="leading-relaxed">
          <strong className="text-zinc-200">Ephemeral Privacy:</strong> Your document is parsed in-memory on the server and
          immediately discarded. We do not store raw resume files on public cloud buckets or execute embedded macros.
        </p>
      </div>

      {/* Error announcements */}
      {(clientError || errorMessage) && (
        <div
          role="alert"
          className="p-3.5 rounded-xl border border-red-900/80 bg-red-950/40 text-red-300 text-xs flex items-start gap-2.5 animate-in fade-in"
        >
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-semibold text-red-200">{errorCode || "Upload Error"}</p>
            <p>{clientError || errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}
