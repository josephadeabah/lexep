"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { ADMIN_NAV } from "@/lib/nav-config";
import { HelpCircle, LogOut, Bell, Settings, Menu, X, Search } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";
import { Avatar } from "@/components/ui/Avatar";

export function AdminShell({ children }: { children: React.ReactNode }) {
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
    } else if (user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user || user.role !== "admin") {
    return (
      <div className="bg-surface text-body-md text-on-surface-variant flex h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="dashboard-shell">
      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="company-brand">
          <div className="company-avatar">
            <Logo variant="dark" size={48} showWordmark={false} />
          </div>
          <div>
            <strong>Lexep Admin</strong>
            <span>Platform Management</span>
          </div>
        </div>

        <nav className="dashboard-nav">
          {ADMIN_NAV.map((item) => {
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
            <a href="#users">Users</a>
            <a href="#help">Help</a>
          </nav>

          <button className="icon-button" aria-label="Notifications">
            <Bell size={23} />
          </button>

          <button className="icon-button" aria-label="Settings">
            <Settings size={23} />
          </button>

          <details className="profile-menu">
            <summary className="profile-avatar" aria-label="Open profile menu">
              <Avatar name={user.full_name} size={40} />
            </summary>
            <nav className="profile-dropdown" aria-label="Mobile account navigation">
              <a href="#analytics">Analytics</a>
              <a href="#users">Users</a>
              <a href="#help">Help</a>
              <a href="#profile">Admin Profile</a>
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
          <div className="max-w-container-max mx-auto w-full">{children}</div>
        </main>
      </div>
    </div>
  );
}