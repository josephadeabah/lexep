import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "light" | "dark";
  size?: number;
  showWordmark?: boolean;
  className?: string;
}

export function Logo({ variant = "light", size = 29, showWordmark = true, className }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src="/lexep-logo.png"
        alt="Lexep"
        width={1024}
        height={1024}
        priority
        className={cn("wordmark-logo", variant === "dark" && "logo-mark-light")}
        style={{ width: size, height: "auto" }}
      />
      {showWordmark && <span className="logo-wordmark">lexep</span>}
    </span>
  );
}
