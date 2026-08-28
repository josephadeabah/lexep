import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { clsx } from "clsx";

const buttonVariants = cva(
  "shrink-0 items-center justify-center gap-2 font-['Inter'] font-semibold transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary:
          "bg-[#d4af37] text-[#1b1c1c] hover:bg-[#c9a32e] hover:shadow-[0_8px_18px_rgba(62,52,16,0.13)] hover:-translate-y-0.5",
        secondary: "bg-[#1b1c1c] text-white hover:bg-[#2a2b2b] hover:-translate-y-0.5",
        outline:
          "border border-[#d9d3c6] bg-transparent text-[#1b1c1c] hover:bg-[#f5f3f3] hover:border-[#735c00]",
        ghost: "bg-transparent text-[#6d6a66] hover:bg-[#f5f3f3] hover:text-[#1b1c1c]",
        destructive: "bg-[#ba1a1a]/10 text-[#ba1a1a] hover:bg-[#ba1a1a]/20",
        link: "text-[#735c00] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 text-sm rounded-[var(--radius)]",
        sm: "h-9 px-4 text-sm rounded-[var(--radius)]",
        lg: "h-12 px-6 text-base rounded-lg",
        icon: "h-11 w-11 rounded-[var(--radius)]",
        "icon-sm": "h-9 w-9 rounded-[var(--radius)]",
        "icon-lg": "h-12 w-12 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

type ButtonProps = Omit<ComponentPropsWithoutRef<typeof ButtonPrimitive>, "className"> &
  VariantProps<typeof buttonVariants> & {
    className?: string;
    href?: string;
  };

function Button({
  className,
  variant = "primary",
  size = "default",
  href,
  children,
  ...props
}: ButtonProps) {
  const classes = clsx(buttonVariants({ variant, size }), className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <ButtonPrimitive data-slot="button" className={classes} {...props}>
      {children}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
