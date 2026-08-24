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
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-label-md text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline">{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full h-11 rounded-md border border-outline-variant bg-surface-container-lowest px-3 text-body-md text-on-surface placeholder:text-outline",
              "focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary",
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
