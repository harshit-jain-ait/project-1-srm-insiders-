import * as React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: React.ReactNode;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, defaultChecked, onChange, disabled, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const [isChecked, setIsChecked] = React.useState<boolean>(
      checked !== undefined ? !!checked : !!defaultChecked
    );

    React.useEffect(() => {
      if (checked !== undefined) {
        setIsChecked(checked);
      }
    }, [checked]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (checked === undefined) {
        setIsChecked(e.target.checked);
      }
      onChange?.(e);
    };

    return (
      <div className={cn("flex items-start gap-2.5 select-none", className)}>
        <div className="relative flex items-center mt-0.5">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={isChecked}
            disabled={disabled}
            onChange={handleChange}
            className="peer sr-only"
            {...props}
          />
          <div
            className={cn(
              "h-4 w-4 rounded border transition-colors flex items-center justify-center cursor-pointer",
              "border-zinc-700 bg-zinc-950/60 peer-checked:bg-[#356ae6] peer-checked:border-[#356ae6] text-white",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-[#356ae6] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-zinc-950",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
            )}
            aria-hidden="true"
          >
            {isChecked && <Check className="h-3 w-3 stroke-[3]" />}
          </div>
        </div>
        {label && (
          <div className="flex flex-col">
            <label
              htmlFor={inputId}
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
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
