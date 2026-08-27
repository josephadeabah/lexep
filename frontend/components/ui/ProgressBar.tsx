import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  className?: string;
  trackClassName?: string;
}

/** Linear progress bar — Deep Gold fill on light-gray track (DESIGN.md > Progress Indicators). */
export function ProgressBar({ value, className, trackClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={cn("bg-surface-container-high h-1 w-full rounded-full", trackClassName)}>
      <div
        className={cn("bg-primary-container h-1 rounded-full transition-all", className)}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
