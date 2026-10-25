import * as React from "react";
import { cn } from "@/lib/utils";
import { UploadCloud, FileText, X, AlertCircle } from "lucide-react";

export interface FileUploadProps {
  accept?: string;
  maxSizeBytes?: number;
  onFileSelect?: (file: File) => void;
  onFileClear?: () => void;
  selectedFile?: File | null;
  label?: string;
  helperText?: string;
  className?: string;
  disabled?: boolean;
}

export function FileUpload({
  accept = ".pdf,.docx,.txt",
  maxSizeBytes = 5 * 1024 * 1024, // 5MB default
  onFileSelect,
  onFileClear,
  selectedFile: externalFile,
  label = "Upload Document",
  helperText = "Supported formats: PDF, DOCX, TXT up to 5MB",
  className,
  disabled = false,
}: FileUploadProps) {
  const [internalFile, setInternalFile] = React.useState<File | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const currentFile = externalFile !== undefined ? externalFile : internalFile;

  const validateAndSelect = (file: File) => {
    setError(null);
    if (file.size > maxSizeBytes) {
      const maxMb = Math.round(maxSizeBytes / (1024 * 1024));
      setError(`File exceeds the ${maxMb}MB size limit.`);
      return;
    }

    if (externalFile === undefined) {
      setInternalFile(file);
    }
    onFileSelect?.(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const handleClear = () => {
    if (externalFile === undefined) {
      setInternalFile(null);
    }
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileClear?.();
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="sr-only"
        id="file-upload-input"
      />

      {!currentFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && fileInputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center p-6 rounded-lg border border-dashed transition-colors cursor-pointer select-none text-center",
            isDragging
              ? "border-[#356ae6] bg-[#356ae6]/10"
              : "border-zinc-800 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/30",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 mb-2.5">
            <UploadCloud className="h-5 w-5" />
          </div>
          <p className="text-xs font-medium text-zinc-200">
            {label} or drag and drop
          </p>
          <p className="text-[11px] text-zinc-400 mt-1">
            {helperText}
          </p>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-900/50">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded bg-zinc-800 text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">
                {currentFile.name}
              </p>
              <p className="text-[11px] text-zinc-400 font-mono">
                {(currentFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded text-zinc-400 hover:text-red-400 cursor-pointer"
            aria-label="Remove selected file"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
