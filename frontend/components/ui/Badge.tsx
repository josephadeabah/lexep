import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "error" | "primary";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-secondary-container text-on-secondary-container",
  success: "bg-[#dcefe1] text-[#276b3b]",
  warning: "bg-primary-fixed text-on-primary-fixed-variant",
  error: "bg-error-container text-on-error-container",
  primary: "bg-primary-container text-on-primary-container",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "text-label-sm inline-flex items-center gap-1.5 rounded-full px-2.5 py-1",
        toneClasses[tone],
        className
      )}
      {...props}
    >
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
