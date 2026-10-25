import * as React from "react";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  onDismiss?: () => void;
}

export function Alert({
  variant = "info",
  title,
  onDismiss,
  className,
  children,
  ...props
}: AlertProps) {
  const configs = {
    info: {
      icon: Info,
      container: "bg-blue-950/20 border-blue-900/40 text-blue-200",
      iconColor: "text-blue-400",
      titleColor: "text-blue-100",
    },
    success: {
      icon: CheckCircle2,
      container: "bg-emerald-950/20 border-emerald-900/40 text-emerald-200",
      iconColor: "text-emerald-400",
      titleColor: "text-emerald-100",
    },
    warning: {
      icon: AlertTriangle,
      container: "bg-amber-950/20 border-amber-900/40 text-amber-200",
      iconColor: "text-amber-400",
      titleColor: "text-amber-100",
    },
    error: {
      icon: AlertCircle,
      container: "bg-red-950/20 border-red-900/40 text-red-200",
      iconColor: "text-red-400",
      titleColor: "text-red-100",
    },
  };

  const current = configs[variant];
  const Icon = current.icon;

  return (
    <div
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "relative flex items-start gap-3 rounded-lg border p-4 text-xs leading-relaxed",
        current.container,
        className
      )}
      {...props}
    >
      <Icon className={cn("h-4 w-4 shrink-0 mt-0.5", current.iconColor)} aria-hidden="true" />
      <div className="flex-1 space-y-1">
        {title && (
          <h5 className={cn("font-medium tracking-tight", current.titleColor)}>
            {title}
          </h5>
        )}
        <div className="text-zinc-300 font-light">{children}</div>
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="p-1 rounded text-zinc-400 hover:text-white cursor-pointer"
          aria-label="Dismiss alert"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
