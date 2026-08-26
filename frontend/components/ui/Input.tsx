import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, hint, error, icon, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-label-md text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="text-outline absolute top-1/2 left-3 -translate-y-1/2">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "border-outline-variant bg-surface-container-lowest text-body-md text-on-surface placeholder:text-outline h-11 w-full rounded-md border px-3",
              "focus:border-primary focus:ring-primary-container focus:ring-2 focus:outline-none",
              icon && "pl-10",
              error && "border-error focus:ring-error-container",
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <span className="text-label-sm text-on-surface-variant">{hint}</span>}
        {error && <span className="text-label-sm text-error">{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";
