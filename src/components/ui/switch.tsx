import * as React from "react";
import { cn } from "@/lib/utils";

export interface SwitchProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  label?: React.ReactNode;
  description?: string;
  className?: string;
}

export function Switch({
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  id,
  name,
  label,
  description,
  className,
}: SwitchProps) {
  const generatedId = React.useId();
  const switchId = id || generatedId;

  const [internalChecked, setInternalChecked] = React.useState<boolean>(defaultChecked);
  const isChecked = checked !== undefined ? checked : internalChecked;

  const toggle = () => {
    if (disabled) return;
    const next = !isChecked;
    if (checked === undefined) {
      setInternalChecked(next);
    }
    onCheckedChange?.(next);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      toggle();
    }
  };

  return (
    <div className={cn("flex items-start gap-3 select-none", className)}>
      <button
        type="button"
        role="switch"
        aria-checked={isChecked}
        id={switchId}
        name={name}
        disabled={disabled}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#356ae6] focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
          "disabled:cursor-not-allowed disabled:opacity-50",
          isChecked ? "bg-[#356ae6]" : "bg-zinc-800"
        )}
      >
        <span
          className={cn(
            "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
            isChecked ? "translate-x-4" : "translate-x-0"
          )}
        />
      </button>

      {label && (
        <div className="flex flex-col">
          <label
            htmlFor={switchId}
            onClick={toggle}
            className={cn(
              "text-xs font-medium text-zinc-200 cursor-pointer",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            {label}
          </label>
          {description && (
            <p className="text-[11px] text-zinc-400 leading-normal mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
