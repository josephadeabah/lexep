"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { OfflineBanner } from "./OfflineBanner";
import { useAuthStore } from "@/lib/auth-store";
import { NAV_BY_ROLE, BRAND_BY_ROLE } from "@/lib/nav-config";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/Button";

/** Shell for the four non-admin roles (learner/mentor/company). Admins are
 * routed to /admin/* (see components/layout/AdminShell.tsx) — routes that
 * need to work for every role including admin (Courses, Notifications) use
 * SharedShell instead of this one. */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isInitialized, hydrate, logout } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [router]);

  if (!isInitialized || !user || !user.role || user.role === "admin") {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface-variant text-body-md">
        Loading your workspace…
      </div>
    );
  }

  const role = user.role;
  const config = BRAND_BY_ROLE[role];

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Mobile Navbar */}
      <div className="fixed top-0 z-30 flex w-full items-center justify-between bg-[#1a1a1a] px-4 py-3 md:hidden">
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="text-inverse-on-surface"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
        <span className="font-serif text-xl font-bold text-[#f4d36a]">{config.brand}</span>
        <div className="w-6" /> {/* Spacer for alignment */}
      </div>

      <Sidebar
        brand={config.brand}
        tagline={config.tagline}
        navItems={NAV_BY_ROLE[role]}
        ctaLabel={config.ctaLabel}
        ctaHref={config.ctaHref}
        userSummary={{ name: user.full_name, roleLabel: config.roleLabel, avatarUrl: user.avatar_url }}
        onLogout={() => {
          logout();
          router.replace("/sign-in");
        }}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <main className="flex-1 overflow-y-auto pt-16 md:pt-0">
        <OfflineBanner />
        <div className="px-md py-lg md:px-xl md:py-xl">
          <div className="mx-auto w-full max-w-container-max">{children}</div>
        </div>
      </main>
    </div>
  );
}