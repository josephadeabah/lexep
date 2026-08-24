import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "light" = on a light/white surface (uses the gold mark). "dark" = on a
   * dark surface like the sidebar (uses the white mark). */
  variant?: "light" | "dark";
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

/** The Lexep "loop" mark, in the two HD variants supplied by brand:
 * gold-on-transparent for light backgrounds, white-on-transparent (sourced
 * from the black-background asset) for dark surfaces like the sidebar. */
export function Logo({ variant = "light", size = 28, showWordmark = true, className }: LogoProps) {
  const src = variant === "dark" ? "/brand/lexep-mark-white.png" : "/brand/lexep-mark-gold.png";
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src={src}
        alt="Lexep"
        width={size}
        height={size}
        style={{ width: size, height: "auto" }}
      />
      {showWordmark && (
        <span
          className={cn(
            "text-headline-md",
            variant === "dark" ? "text-primary-fixed-dim" : "text-primary"
          )}
        >
          Lexep
        </span>
      )}
    </span>
  );
}
