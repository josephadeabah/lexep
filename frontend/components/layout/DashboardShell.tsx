"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { NAV_BY_ROLE } from "@/lib/nav-config";
import { HelpCircle, LogOut, Bell, Settings, Menu, X, Search } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Avatar } from "@/components/ui/Avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
    ctaLabel: "New Application",
    ctaHref: "/opportunities/new",
    roleLabel: "Company",
  },
  admin: {
    brand: "Lexep Admin",
    tagline: "Platform Management",
    roleLabel: "Admin",
  },
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  if (!isInitialized || !user || !user.role || user.role === "admin") {
    return (
      <div className="bg-surface text-body-md text-on-surface-variant flex h-screen items-center justify-center">
        Loading your workspace…
      </div>
    );
  }

  const role = user.role;
  const config = BRAND_BY_ROLE[role];

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="company-brand">
          <div className="company-avatar">
            <Logo variant="dark" size={48} showWordmark={false} />
          </div>
          <div>
            <strong>{config.brand}</strong>
            <span>{config.tagline}</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center gap-3 rounded-md bg-white/5 p-3">
            <Avatar name={user.full_name} src={user.avatar_url} size={36} />
            <div className="min-w-0">
              <p className="truncate text-[#f4d36a]">{user.full_name}</p>
              <p className="truncate text-[#bdbbb8] text-sm">{config.roleLabel}</p>
            </div>
          </div>
        )}

        {config.ctaLabel && (
          <Link
            href={config.ctaHref || "#"}
            className="dashboard-nav-item bg-[#ddb839] text-[#171717] font-bold rounded-md m-4"
          >
            {config.ctaLabel}
          </Link>
        )}

        <nav className="dashboard-nav">
          {NAV_BY_ROLE[role].map((item) => {
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
          <Link href="/help" className="dashboard-nav-item">
            <HelpCircle size={21} />
            <span>Help Center</span>
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
            <a href="#analytics">Analytics</a>
            <a href="#talent">Talent Pool</a>
            <a href="#help">Help</a>
          </nav>

          {role === "company" && (
            <button className="post-button">Post Internship</button>
          )}

          <button className="icon-button" aria-label="Notifications">
            <Bell size={23} />
          </button>

          <button className="icon-button" aria-label="Settings">
            <Settings size={23} />
          </button>

          <details className="profile-menu">
            <summary className="profile-avatar" aria-label="Open profile menu">
              <Avatar name={user.full_name} src={user.avatar_url} size={40} />
            </summary>
            <nav className="profile-dropdown" aria-label="Mobile account navigation">
              <a href="#analytics">Analytics</a>
              <a href="#talent">Talent Pool</a>
              <a href="#help">Help</a>
              <a href="#profile">{config.roleLabel} Profile</a>
              <button
                className="dashboard-nav-item"
                onClick={() => {
                  logout();
                  router.replace("/sign-in");
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </nav>
          </details>
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