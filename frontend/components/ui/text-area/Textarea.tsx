import { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import styles from "./textarea.module.css";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, hint, id, ...props }, ref) => {
    const areaId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className={styles.wrapper}>
        {label && (
          <label htmlFor={areaId} className={styles.label}>
            {label}
          </label>
        )}
        <textarea ref={ref} id={areaId} className={cn(styles.textarea, className)} {...props} />
        {hint && <span className={styles.hint}>{hint}</span>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
