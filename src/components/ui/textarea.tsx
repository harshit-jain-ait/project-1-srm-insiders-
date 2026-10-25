import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, hasError, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-md border bg-zinc-950/60 px-3 py-2 text-sm shadow-sm text-zinc-100 placeholder:text-zinc-500",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#356ae6] focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950",
          "disabled:cursor-not-allowed disabled:opacity-50",
          hasError
            ? "border-red-500/80 focus-visible:ring-red-500"
            : "border-zinc-800 hover:border-zinc-700 focus-visible:border-transparent",
          className
        )}
        aria-invalid={hasError ? "true" : undefined}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
