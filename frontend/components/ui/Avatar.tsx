import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        width={size}
        height={size}
        className={cn("rounded-full object-cover", className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span
      className={cn(
        "font-label-md bg-primary-container text-on-primary-container flex items-center justify-center rounded-full",
        className
      )}
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </span>
  );
}
