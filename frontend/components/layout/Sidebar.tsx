"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/Avatar";
import { Logo } from "@/components/ui/Logo";
import type { NavItem } from "@/lib/nav-config";

interface SidebarProps {
  brand?: string;
  tagline?: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  userSummary?: { name: string; roleLabel: string; avatarUrl?: string | null };
  onLogout?: () => void;
}

export function Sidebar({
  brand = "Architect Portal",
  tagline = "Empowering African Youth",
  navItems,
  ctaLabel = "New Application",
  ctaHref = "/opportunities/new",
  userSummary,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex h-screen w-sidebar flex-shrink-0 flex-col justify-between bg-[#1a1a1a] px-md py-lg text-inverse-on-surface">
      <div className="flex flex-col gap-lg">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="dark" size={24} showWordmark={false} />
            <span className="text-headline-md text-primary-fixed-dim">{brand}</span>
          </Link>
          <p className="mt-1 text-label-sm text-[#a8a6a5]">{tagline}</p>
        </div>

        {userSummary && (
          <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
            <Avatar name={userSummary.name} src={userSummary.avatarUrl} size={36} />
            <div className="min-w-0">
              <p className="truncate text-label-md text-inverse-on-surface">{userSummary.name}</p>
              <p className="truncate text-label-sm text-[#a8a6a5]">{userSummary.roleLabel}</p>
            </div>
          </div>
        )}

        {ctaLabel && (
          <Link
            href={ctaHref || "#"}
            className="flex h-11 items-center justify-center rounded-md bg-primary-container px-4 text-label-md text-on-primary-container hover:brightness-95"
          >
            {ctaLabel}
          </Link>
        )}

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex items-center gap-3 rounded-md px-3 py-2.5 text-label-md transition",
                  active
                    ? "bg-white/10 text-primary-fixed-dim"
                    : "text-[#c9c7c6] hover:bg-white/5 hover:text-inverse-on-surface"
                )}
              >
                {active && (
                  <span className="absolute left-0 top-1 bottom-1 w-[3px] rounded-full bg-primary-container" />
                )}
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-1 border-t border-white/10 pt-md">
        <Link
          href="/help"
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-label-md text-[#c9c7c6] hover:bg-white/5"
        >
          <HelpCircle className="h-4 w-4" />
          Help Center
        </Link>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-label-md text-[#c9c7c6] hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
