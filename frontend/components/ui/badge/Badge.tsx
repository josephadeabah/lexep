import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import styles from "./badge.module.css";

type Tone = "neutral" | "success" | "warning" | "error" | "primary";

const toneClasses: Record<Tone, string> = {
  neutral: styles.neutral,
  success: styles.success,
  warning: styles.warning,
  error: styles.error,
  primary: styles.primary,
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(styles.badge, toneClasses[tone], className)}
      {...props}
    >
      {dot && <span className={styles.dot} />}
      {children}
    </span>
  );
}