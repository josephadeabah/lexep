"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { OfflineBanner } from "./OfflineBanner";
import { useAuthStore } from "@/lib/auth-store";
import { NAV_BY_ROLE, BRAND_BY_ROLE } from "@/lib/nav-config";

/** Shell for the four non-admin roles (learner/mentor/company). Admins are
 * routed to /admin/* (see components/layout/AdminShell.tsx) — routes that
 * need to work for every role including admin (Courses, Notifications) use
 * SharedShell instead of this one. */
export function DashboardShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface-variant text-body-md">
        Loading your workspace…
      </div>
    );
  }

  const role = user.role;
  const config = BRAND_BY_ROLE[role];

  return (
    <div className="flex min-h-screen bg-surface">
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
      />
      <main className="flex-1 overflow-y-auto">
        <OfflineBanner />
        <div className="px-md py-lg md:px-xl md:py-xl">
          <div className="mx-auto w-full max-w-container-max">{children}</div>
        </div>
      </main>
    </div>
  );
}
