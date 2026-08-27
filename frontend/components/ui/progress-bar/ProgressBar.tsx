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
    <div className={cn(styles.track, trackClassName)}>
      <div className={cn(styles.fill, className)} style={{ width: `${clamped}%` }} />
    </div>
  );
}
