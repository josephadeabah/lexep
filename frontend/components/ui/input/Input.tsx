import { InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./input.module.css";

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
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div className={styles.inputWrapper}>
          {icon && (
            <span className={styles.icon}>{icon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              styles.input,
              icon && styles.inputWithIcon,
              error && styles.inputError,
              className
            )}
            {...props}
          />
        </div>
        {hint && !error && <span className={styles.hint}>{hint}</span>}
        {error && <span className={styles.error}>{error}</span>}
      </div>
    );
  }
);
Input.displayName = "Input";