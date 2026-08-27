import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/** Level-1 elevated surface used across the app for opportunity cards,
 *  form panels, and dashboard tiles (DESIGN.md > Elevation & Depth). */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("bg-surface-container-lowest shadow-level1 p-md rounded-lg", className)}
      {...props}
    />
  );
}
