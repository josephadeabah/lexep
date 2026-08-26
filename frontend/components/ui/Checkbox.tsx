import { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const boxId = id || Math.random().toString(36).slice(2);
    return (
      <label
        htmlFor={boxId}
        className={cn("flex cursor-pointer items-start gap-3 select-none", className)}
      >
        <span className="relative mt-0.5 flex-shrink-0">
          <input
            ref={ref}
            id={boxId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              "border-outline-variant bg-surface-container-lowest flex h-5 w-5 items-center justify-center rounded-sm border transition",
              "peer-checked:border-primary-container peer-checked:bg-primary-container",
              "peer-focus-visible:ring-primary-container peer-focus-visible:ring-2"
            )}
          >
            {checked && <Check className="text-on-primary-container h-3.5 w-3.5" strokeWidth={3} />}
          </span>
        </span>
        {(label || description) && (
          <span className="flex flex-col">
            {label && <span className="text-body-md text-on-surface">{label}</span>}
            {description && (
              <span className="text-label-sm text-on-surface-variant">{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
