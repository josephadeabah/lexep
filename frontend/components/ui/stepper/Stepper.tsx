import { cn } from "@/lib/utils";
import styles from "./stepper.module.css";

interface StepperProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export function Stepper({ currentStep, totalSteps, label }: StepperProps) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.stepText}>
          STEP {currentStep} OF {totalSteps}
        </span>
        {label && <span className={styles.label}>{label}</span>}
      </div>
      <div className={styles.track}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              styles.step,
              i < currentStep ? styles.active : styles.inactive
            )}
          />
        ))}
      </div>
    </div>
  );
}