import { ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
}

const variantClasses: Record<Variant, string> = {
  // Primary: Deep Gold background, Charcoal text, no border (DESIGN.md > Buttons)
  primary: "bg-primary-container text-on-primary-container hover:brightness-95",
  // Secondary: Charcoal background, White text
  secondary: "bg-inverse-surface text-inverse-on-surface hover:opacity-90",
  // Ghost: transparent, subtle border
  ghost:
    "bg-transparent text-on-surface border border-outline-variant hover:bg-surface-container-low",
  danger: "bg-error text-on-error hover:brightness-95",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-9 px-3 text-label-sm",
  md: "h-11 px-5 text-label-md",
  lg: "h-12 px-6 text-label-md",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", href, children, ...props }, ref) => {
    const classes = cn(
      "inline-flex items-center justify-center gap-2 rounded-md font-label-md transition disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap",
      variantClasses[variant],
      sizeClasses[size],
      className
    );

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
