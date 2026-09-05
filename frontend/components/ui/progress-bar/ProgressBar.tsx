import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  className?: string;
  trackClassName?: string;
}

export function ProgressBar({ value, className, trackClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div
      className={cn("w-full h-1 rounded-full bg-[#f0f0f0]", trackClassName)}
      data-testid="progress-track"
    >
      <div
        className={cn(
          "h-1 rounded-full transition-all duration-300 ease-in-out",
          className || "bg-[#f4d36a]"
        )}
        style={{ width: `${clamped}%` }}
        data-testid="progress-fill"
      />
    </div>
  );
}