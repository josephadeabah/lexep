import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "error" | "primary";

const toneClasses: Record<Tone, string> = {
  neutral: "bg-[#d9d3c6] text-[#6d6a66]",
  success: "bg-[#dcefe1] text-[#276b3b]",
  warning: "bg-[#fff0d9] text-[#e97512]",
  error: "bg-[#ffdad6] text-[#ba1a1a]",
  primary: "bg-[#f7edc9] text-[#735c00]",
};

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: Tone;
  dot?: boolean;
}

export function Badge({ className, tone = "neutral", dot, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium leading-4",
        "font-sans",
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