interface DonutProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

/** Circular "Donut" progress used for match scores (DESIGN.md > Progress Indicators). */
export function DonutProgress({ percent, size = 64, strokeWidth = 5, label }: DonutProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-surface-container-high"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary-container transition-all"
        />
      </svg>
      <span className="font-label-md text-label-sm text-on-surface absolute">
        {label ?? `${percent}%`}
      </span>
    </div>
  );
}
