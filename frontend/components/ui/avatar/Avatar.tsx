import Image from "next/image";
import { cn, initials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  if (src) {
    return (
      <div
        className={cn("rounded-full overflow-hidden flex-shrink-0", className)}
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={name}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full overflow-hidden flex-shrink-0",
        "bg-primary-container text-on-primary-container font-semibold",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(10, size * 0.35),
        fontFamily: "var(--font-inter), Inter, sans-serif",
      }}
    >
      {initials(name)}
    </div>
  );
}