import * as React from "react";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  onClear?: () => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, disabled, ...props }, ref) => {
    const hasValue = value !== undefined && String(value).length > 0;

    return (
      <div className={cn("relative flex items-center w-full", className)}>
        <Search
          className="absolute left-3 h-4 w-4 text-zinc-400 pointer-events-none"
          aria-hidden="true"
        />
        <input
          type="search"
          ref={ref}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950/60 pl-9 pr-8 py-1 text-sm shadow-sm transition-colors text-zinc-100 placeholder:text-zinc-500",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#356ae6] focus-visible:ring-offset-1 focus-visible:ring-offset-zinc-950 focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50"
          )}
          {...props}
        />
        {hasValue && onClear && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-2.5 p-1 rounded-sm text-zinc-400 hover:text-zinc-200 cursor-pointer"
            aria-label="Clear search input"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
