import { cn } from "@/lib/utils";
import styles from "./progress-bar.module.css";

interface ProgressBarProps {
  value: number;
  className?: string;
  trackClassName?: string;
}

export function ProgressBar({ value, className, trackClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={`${styles.track} ${trackClassName || ""}`} data-testid="progress-track">
      <div
        className={`${styles.fill} ${className || ""}`}
        style={{ width: `${clamped}%` }}
        data-testid="progress-fill"
      />
    </div>
  );
}
