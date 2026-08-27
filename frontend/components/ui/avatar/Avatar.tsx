import Image from "next/image";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";
import styles from "./avatar.module.css";

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
        className={cn(styles.avatar, className)}
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <span className={cn(styles.avatarFallback, className)} style={{ width: size, height: size }}>
      {initials(name)}
    </span>
  );
}
