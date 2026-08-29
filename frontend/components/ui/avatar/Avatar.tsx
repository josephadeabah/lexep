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
      <div
        className={cn(styles.avatar, className)}
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
      className={cn(styles.avatarFallback, className)}
      style={{ width: size, height: size }}
    >
      {initials(name)}
    </div>
  );
}