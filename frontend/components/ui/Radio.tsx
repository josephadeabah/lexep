import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface RadioProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
            type="radio"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              "border-outline-variant bg-surface-container-lowest flex h-5 w-5 items-center justify-center rounded-full border transition",
              "peer-checked:border-primary-container",
              "peer-focus-visible:ring-primary-container peer-focus-visible:ring-2"
            )}
          >
            {checked && <span className="bg-primary-container h-2.5 w-2.5 rounded-full" />}
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
Radio.displayName = "Radio";
