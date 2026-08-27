"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { NAV_BY_ROLE, ADMIN_NAV } from "@/lib/nav-config";
import { HelpCircle, LogOut, Bell, Settings, Menu, X, Search, ShieldCheck } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/avatar/Avatar";
import Link from "next/link";
import type { UserRole } from "@/lib/types";
import { OfflineBanner } from "./OfflineBanner";

const BRAND_BY_ROLE: Record<
  UserRole,
  { brand: string; tagline: string; ctaLabel?: string; ctaHref?: string; roleLabel: string }
> = {
  learner: {
    brand: "Lexep",
    tagline: "Student Portal",
    ctaLabel: "Upgrade to Pro",
    ctaHref: "/upgrade?plan=learner_plus",
    roleLabel: "Lexep Architect",
  },
  mentor: {
    brand: "Architect Portal",
    tagline: "Empowering African Youth",
    roleLabel: "Mentor",
  },
  company: {
    brand: "Architect Portal",
    tagline: "Empowering African Youth",
    ctaLabel: "Upgrade Plan",
    ctaHref: "/upgrade",
    roleLabel: "Company",
  },
  admin: {
    brand: "Lexep Admin",
    tagline: "Platform Management",
    roleLabel: "Admin",
  },
};

const HEADER_LINKS_BY_ROLE: Record<UserRole, { label: string; href: string }[]> = {
  learner: [
    { label: "Analytics", href: "#analytics" },
    { label: "Help", href: "#help" },
  ],
  mentor: [
    { label: "Analytics", href: "#analytics" },
    { label: "Learners", href: "#learners" },
    { label: "Help", href: "#help" },
  ],
  company: [
    { label: "Analytics", href: "#analytics" },
    { label: "Talent Pool", href: "#talent" },
    { label: "Help", href: "#help" },
  ],
  admin: [
    { label: "Admin Settings", href: "#admin-settings" },
    { label: "Profile", href: "#profile" },
  ],
};

const HEADER_BUTTON_BY_ROLE: Record<
  UserRole,
  { label: string; href?: string; onClick?: () => void } | undefined
> = {
  learner: undefined,
  mentor: undefined,
  company: { label: "Post Internship", href: "/opportunities/new" },
  admin: undefined,
};

const SIDEBAR_BOTTOM_BY_ROLE: Record<
  UserRole,
  {
    label: string;
    icon?: React.ComponentType<{ size?: number }>;
    href?: string;
    onClick?: () => void;
  }[]
> = {
  learner: [],
  mentor: [],
  company: [],
  admin: [{ label: "System Status", href: "#system-status", icon: ShieldCheck }],
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isInitialized, hydrate, logout } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) hydrate();
  }, [isInitialized, hydrate]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (user.role === "admin") {
      router.replace("/admin/applications");
    } else if (!user.role) {
      router.replace("/onboarding/choose-role");
    } else if (!user.onboarding_completed) {
      router.replace(`/onboarding/${user.role}`);
    }
  }, [isInitialized, user, router]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileOpen && !(event.target as Element).closest(".profile-menu")) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [profileOpen]);

  if (!isInitialized || !user || !user.role) {
    return (
      <div className="bg-surface text-body-md text-on-surface-variant flex h-screen items-center justify-center">
        Loading your workspace…
      </div>
    );
  }

  const role = user.role;
  const brandConfig = BRAND_BY_ROLE[role];
  const navItems = role === "admin" ? ADMIN_NAV : NAV_BY_ROLE[role];
  const headerLinks = HEADER_LINKS_BY_ROLE[role] || [];
  const headerButton = HEADER_BUTTON_BY_ROLE[role];
  const sidebarBottom = SIDEBAR_BOTTOM_BY_ROLE[role] || [];

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="company-brand">
          <div className="company-avatar">
            <Logo variant="dark" size={48} showWordmark={false} />
          </div>
          <div>
            <strong>{brandConfig.brand}</strong>
            <span>{brandConfig.tagline}</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
            <Avatar name={user.full_name} src={user.avatar_url} size={36} />
            <div className="min-w-0">
              <p className="truncate text-[#f4d36a]">{user.full_name}</p>
              <p className="truncate text-sm text-[#bdbbb8]">{brandConfig.roleLabel}</p>
            </div>
          </div>
        )}

        {brandConfig.ctaLabel && (
          <Link
            href={brandConfig.ctaHref || "#"}
            className="dashboard-nav-item m-4 rounded-md bg-[#ddb839] font-bold text-[#171717]"
          >
            {brandConfig.ctaLabel}
          </Link>
        )}

        <nav className="dashboard-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || pathname?.startsWith(`${item.href}/`);
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
          {sidebarBottom.map((item) => (
            <Link key={item.label} href={item.href || "#"} className="dashboard-nav-item">
              {item.icon && <item.icon size={21} />}
              {item.label}
            </Link>
          ))}

          <Link href="/help" className="dashboard-nav-item">
            <HelpCircle size={21} />
            <span>Support</span>
          </Link>

          <button
            className="dashboard-nav-item"
            onClick={() => {
              logout();
              router.replace("/sign-in");
            }}
          >
            <LogOut size={21} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile scrim */}
      {sidebarOpen && (
        <button
          className="sidebar-scrim"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Content */}
      <div className="dashboard-content">
        {/* Top Navigation */}
        <header className="dashboard-header">
          <button
            className="dashboard-menu"
            aria-label={sidebarOpen ? "Close dashboard menu" : "Open dashboard menu"}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <label className="dashboard-search">
            <Search size={17} aria-hidden="true" />
            <span className="sr-only">Search</span>
            <input placeholder="Search..." />
          </label>

          <nav className="dashboard-top-nav" aria-label="Account navigation">
            {headerLinks.map((link) => (
              <a key={link.label} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right-side group - always stays at right */}
          <div className="ml-auto flex items-center gap-2">
            {headerButton && (
              <Link href={headerButton.href || "#"} className="post-button">
                {headerButton.label}
              </Link>
            )}

            <button className="icon-button" aria-label="Notifications">
              <Bell size={23} />
            </button>

            <button className="icon-button" aria-label="Settings">
              <Settings size={23} />
            </button>

            {/* Profile Menu */}
            <div className="profile-menu">
              <button
                className="profile-avatar"
                aria-label="Open profile menu"
                onClick={() => setProfileOpen(!profileOpen)}
              >
                <Avatar name={user.full_name} src={user.avatar_url} size={40} />
              </button>

              {profileOpen && (
                <nav className="profile-dropdown" aria-label="Account navigation">
                  {headerLinks.map((link) => (
                    <a key={link.label} href={link.href} onClick={() => setProfileOpen(false)}>
                      {link.label}
                    </a>
                  ))}
                  <a href="#profile" onClick={() => setProfileOpen(false)}>
                    {brandConfig.roleLabel} Profile
                  </a>
                  <button
                    className="dashboard-nav-item"
                    onClick={() => {
                      setProfileOpen(false);
                      logout();
                      router.replace("/sign-in");
                    }}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </nav>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          <OfflineBanner />
          <div className="max-w-container-max mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}