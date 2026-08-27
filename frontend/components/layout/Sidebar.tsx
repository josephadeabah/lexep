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
    <aside className="dashboard-sidebar">
      <div className="company-brand">
        <div className="company-avatar">
          <Logo variant="dark" size={48} showWordmark={false} />
        </div>
        <div>
          <strong>{brand}</strong>
          <span>{tagline}</span>
        </div>
      </div>

      {userSummary && (
        <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
          <Avatar name={userSummary.name} src={userSummary.avatarUrl} size={36} />
          <div className="min-w-0">
            <p className="truncate text-[#f4d36a]">{userSummary.name}</p>
            <p className="truncate text-[#bdbbb8] text-sm">{userSummary.roleLabel}</p>
          </div>
        </div>
      )}

      {ctaLabel && (
        <Link
          href={ctaHref || "#"}
          className="dashboard-nav-item bg-[#ddb839] text-[#171717] font-bold rounded-md m-4"
        >
          {ctaLabel}
        </Link>
      )}

      <nav className="dashboard-nav">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`dashboard-nav-item ${active ? "active" : ""}`}
            >
              <Icon size={21} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        <Link href="/help" className="dashboard-nav-item">
          <HelpCircle size={21} />
          Help Center
        </Link>
        <button onClick={onLogout} className="dashboard-nav-item">
          <LogOut size={21} />
          Logout
        </button>
      </div>
    </aside>
  );
}