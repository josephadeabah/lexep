import styles from "./donut-progress.module.css";

interface DonutProgressProps {
  percent: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}

export function DonutProgress({ percent, size = 64, strokeWidth = 5, label }: DonutProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      className={styles.wrapper}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className={styles.svg}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={styles.track}
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
          className={styles.fill}
        />
      </svg>
      <span className={styles.label}>
        {label ?? `${percent}%`}
      </span>
    </div>
  );
}