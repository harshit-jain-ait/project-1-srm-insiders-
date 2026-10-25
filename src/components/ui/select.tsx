import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean;
  options?: SelectOption[];
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, hasError, options, children, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            "flex h-9 w-full appearance-none rounded-md border bg-zinc-950/60 pl-3 pr-8 py-1 text-sm shadow-sm transition-colors text-zinc-100",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#356ae6] focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950",
            "disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
            hasError
              ? "border-red-500/80 focus-visible:ring-red-500"
              : "border-zinc-800 hover:border-zinc-700 focus-visible:border-transparent",
            className
          )}
          aria-invalid={hasError ? "true" : undefined}
          {...props}
        >
          {options
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown
          className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400 pointer-events-none"
          aria-hidden="true"
        />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };
