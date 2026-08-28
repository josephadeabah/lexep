"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar/Avatar";
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
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  brand = "Architect Portal",
  tagline = "Empowering African Youth",
  navItems,
  ctaLabel = "New Application",
  ctaHref = "/opportunities/new",
  userSummary,
  onLogout,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <button className="sidebar-scrim" aria-label="Close sidebar" onClick={onClose} />}

      <aside className={`dashboard-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="company-brand">
          <div className="company-avatar">
            <Logo variant="light" size={56} showWordmark={false} />
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
              <p className="truncate text-sm text-[#bdbbb8]">{userSummary.roleLabel}</p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {ctaLabel && (
          <div className="mx-4 my-4">
            <Link
              href={ctaHref || "#"}
              className="flex h-11 items-center justify-center rounded-md bg-[#ddb839] font-bold text-[#171717] transition hover:bg-[#c9a32e]"
            >
              {ctaLabel}
            </Link>
          </div>
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
    </>
  );
}