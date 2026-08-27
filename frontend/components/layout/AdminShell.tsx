"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Sidebar } from "./Sidebar";
import { OfflineBanner } from "./OfflineBanner";
import { ADMIN_NAV } from "@/lib/nav-config";
import { HelpCircle, LogOut } from "lucide-react";
import { Logo } from "../ui/Logo";
import Link from "next/link";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
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
      <aside className="dashboard-sidebar">
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
          <button className="role-nav-item">
            <HelpCircle size={21} />
            <span>Help Center</span>
          </button>
          <button
            className="role-nav-item"
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

      <main className="dashboard-content">
        <OfflineBanner />
        <div className="dashboard-main">
          <div className="max-w-container-max mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}