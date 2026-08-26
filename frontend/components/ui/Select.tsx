import { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, id, children, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-label-md text-on-surface">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "border-outline-variant bg-surface-container-lowest text-body-md text-on-surface h-11 w-full appearance-none rounded-md border px-3 pr-9",
              "focus:border-primary focus:ring-primary-container focus:ring-2 focus:outline-none",
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="text-outline pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";
