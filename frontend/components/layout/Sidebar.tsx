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
    <aside className="w-sidebar px-md py-lg text-inverse-on-surface hidden h-screen flex-shrink-0 flex-col justify-between bg-[#1a1a1a] md:flex">
      <div className="gap-lg flex flex-col">
        <div>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo variant="dark" size={24} showWordmark={false} />
            <span className="text-headline-md text-primary-fixed-dim">{brand}</span>
          </Link>
          <p className="text-label-sm mt-1 text-[#a8a6a5]">{tagline}</p>
        </div>

        {userSummary && (
          <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
            <Avatar name={userSummary.name} src={userSummary.avatarUrl} size={36} />
            <div className="min-w-0">
              <p className="text-label-md text-inverse-on-surface truncate">{userSummary.name}</p>
              <p className="text-label-sm truncate text-[#a8a6a5]">{userSummary.roleLabel}</p>
            </div>
          </div>
        )}

        {ctaLabel && (
          <Link
            href={ctaHref || "#"}
            className="bg-primary-container text-label-md text-on-primary-container flex h-11 items-center justify-center rounded-md px-4 hover:brightness-95"
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
                  "text-label-md relative flex items-center gap-3 rounded-md px-3 py-2.5 transition",
                  active
                    ? "text-primary-fixed-dim bg-white/10"
                    : "hover:text-inverse-on-surface text-[#c9c7c6] hover:bg-white/5"
                )}
              >
                {active && (
                  <span className="bg-primary-container absolute top-1 bottom-1 left-0 w-[3px] rounded-full" />
                )}
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-md flex flex-col gap-1 border-t border-white/10">
        <Link
          href="/help"
          className="text-label-md flex items-center gap-3 rounded-md px-3 py-2.5 text-[#c9c7c6] hover:bg-white/5"
        >
          <HelpCircle className="h-4 w-4" />
          Help Center
        </Link>
        <button
          onClick={onLogout}
          className="text-label-md flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-[#c9c7c6] hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
