import { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./checkbox.module.css";

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  description?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, description, id, checked, ...props }, ref) => {
    const boxId = id || Math.random().toString(36).slice(2);
    return (
      <label htmlFor={boxId} className={cn(styles.label, className)}>
        <span className={styles.boxWrapper}>
          <input
            ref={ref}
            id={boxId}
            type="checkbox"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span className={styles.box}>
            {checked && <Check className={styles.checkIcon} strokeWidth={3} />}
          </span>
        </span>
        {(label || description) && (
          <span className={styles.textWrapper}>
            {label && <span className={styles.labelText}>{label}</span>}
            {description && <span className={styles.description}>{description}</span>}
          </span>
        )}
      </label>
    );
  }
);
Checkbox.displayName = "Checkbox";
