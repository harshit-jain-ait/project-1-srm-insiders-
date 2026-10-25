import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({
  className,
  required,
  children,
  ...props
}: FormLabelProps) {
  return (
    <label
      className={cn(
        "text-xs font-medium text-zinc-300 select-none block mb-1.5",
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-400 ml-1" aria-hidden="true">*</span>}
    </label>
  );
}

export function FormHelperText({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  if (!children) return null;
  return (
    <p
      className={cn("text-xs text-zinc-400 mt-1.5 leading-normal", className)}
      {...props}
    >
      {children}
    </p>
  );
}

export interface FormErrorMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  message?: string;
}

export function FormErrorMessage({
  className,
  message,
  children,
  ...props
}: FormErrorMessageProps) {
  const content = message || children;
  if (!content) return null;

  return (
    <div
      role="alert"
      className={cn(
        "flex items-center gap-1.5 text-xs text-red-400 mt-1.5 font-medium animate-fadeIn",
        className
      )}
      {...props}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
      <span>{content}</span>
    </div>
  );
}
