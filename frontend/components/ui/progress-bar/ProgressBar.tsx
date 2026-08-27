interface ProgressBarProps {
  value: number;
  className?: string;
  trackClassName?: string;
}

export function ProgressBar({ value, className, trackClassName }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  
  return (
    <div 
      className={`h-1 w-full rounded-full bg-[#f0f0f0] ${trackClassName || ""}`}
      data-testid="progress-track"
    >
      <div 
        className={`h-1 rounded-full bg-[#d4af37] transition-all duration-300 ${className || ""}`}
        style={{ width: `${clamped}%` }}
        data-testid="progress-fill"
      />
    </div>
  );
}