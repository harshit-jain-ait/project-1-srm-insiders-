import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", hasError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border bg-zinc-950/60 px-3 py-1 text-sm shadow-sm transition-colors text-zinc-100 placeholder:text-zinc-500",
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
Input.displayName = "Input";

export { Input };
