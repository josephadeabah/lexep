"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, LogOut } from "lucide-react";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Logo } from "@/components/ui/Logo";
import type { NavItem } from "@/lib/nav-config";
import styles from "./sidebar.module.css";

interface SidebarItem {
  label: string;
  icon?: React.ComponentType<{ size?: number }>;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  brand?: string;
  tagline?: string;
  navItems: NavItem[];
  ctaLabel?: string;
  ctaHref?: string;
  sidebarBottom?: SidebarItem[];
  userSummary?: { name: string; roleLabel: string; avatarUrl?: string | null };
  onLogout?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({
  brand = "Architect Portal",
  tagline = "Empowering African Youth",
  navItems,
  ctaLabel = "Upgrade to Pro",
  ctaHref = "/upgrade",
  sidebarBottom = [],
  userSummary,
  onLogout,
  isOpen = false,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {isOpen && <button className={styles.scrim} aria-label="Close sidebar" onClick={onClose} />}

      <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        {/* Brand */}
        <div className={styles.brand}>
          <div className={styles.avatar}>
            <Logo variant="light" size={64} showWordmark={false} />
          </div>
          <div>
            <strong>{brand}</strong>
            <span>{tagline}</span>
          </div>
        </div>

        {/* User Summary */}
        {userSummary && (
          <div className={styles.userSummary}>
            <Avatar name={userSummary.name} src={userSummary.avatarUrl} size={36} />
            <div className="min-w-0">
              <p className={styles.userSummaryName}>{userSummary.name}</p>
              <p className={styles.userSummaryRole}>{userSummary.roleLabel}</p>
            </div>
          </div>
        )}

        {/* CTA Button */}
        {ctaLabel && (
          <div className={styles.ctaWrapper}>
            <Link href={ctaHref || "#"} className={styles.ctaButton}>
              {ctaLabel}
            </Link>
          </div>
        )}

        {/* Navigation */}
        <nav className={styles.nav}>
          {navItems.map((item) => {
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${active ? styles.navItemActive : ""}`}
              >
                <Icon size={21} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className={styles.bottom}>
          {/* Additional sidebar items (e.g. Post Internship for company) */}
          {sidebarBottom.map((item) => (
            <Link key={item.label} href={item.href || "#"} className={styles.navItem}>
              {item.icon && <item.icon size={21} />}
              {item.label}
            </Link>
          ))}

          {/* Help/Support */}
          <Link href="/help" className={styles.navItem}>
            <HelpCircle size={21} />
            Help Center
          </Link>

          {/* Logout */}
          <button onClick={onLogout} className={styles.navItem}>
            <LogOut size={21} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}