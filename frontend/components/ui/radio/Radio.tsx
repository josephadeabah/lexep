import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./radio.module.css";

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
        className={cn(styles.label, className)}
      >
        <span className={styles.radioWrapper}>
          <input
            ref={ref}
            id={boxId}
            type="radio"
            checked={checked}
            className="peer sr-only"
            {...props}
          />
          <span className={styles.radio}>
            {checked && <span className={styles.radioDot} />}
          </span>
        </span>
        {(label || description) && (
          <span className={styles.textWrapper}>
            {label && <span className={styles.labelText}>{label}</span>}
            {description && (
              <span className={styles.description}>{description}</span>
            )}
          </span>
        )}
      </label>
    );
  }
);
Radio.displayName = "Radio";