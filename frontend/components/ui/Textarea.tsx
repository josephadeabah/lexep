import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, id, ...props }, ref) => {
    const areaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={areaId} className="text-label-md text-on-surface">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={areaId}
          className={cn(
            "w-full rounded-md border border-outline-variant bg-surface-container-low px-3 py-2.5 text-body-md text-on-surface placeholder:text-outline min-h-[140px]",
            "focus:outline-none focus:ring-2 focus:ring-primary-container focus:border-primary",
            className
          )}
          {...props}
        />
        {hint && <span className="text-label-sm text-on-surface-variant">{hint}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
