import { cn } from "@/lib/utils";

interface StepperProps {
  currentStep: number; // 1-indexed
  totalSteps: number;
  label?: string;
}

/** Top-of-form progress indicator used across every multi-step wizard
 *  (onboarding, mentor application, grant application, post-internship). */
export function Stepper({ currentStep, totalSteps, label }: StepperProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="text-label-sm text-on-surface-variant flex items-center justify-between">
        <span>
          STEP {currentStep} OF {totalSteps}
        </span>
        {label && <span className="text-primary font-label-md">{label}</span>}
      </div>
      <div className="flex w-full gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full",
              i < currentStep ? "bg-primary-container" : "bg-surface-container-high"
            )}
          />
        ))}
      </div>
    </div>
  );
}
