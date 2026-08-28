import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-[#e0d8c9] bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]",
        className
      )}
      {...props}
    />
  );
}