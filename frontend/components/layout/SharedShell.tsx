"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { OfflineBanner } from "./OfflineBanner";
import { useAuthStore } from "@/lib/auth-store";
import { NAV_BY_ROLE, ADMIN_NAV, BRAND_BY_ROLE } from "@/lib/nav-config";

/** Used by routes whose content is meaningful for every role, including
 * admin — e.g. Courses (Admin/Company manage, learners browse) and
 * Notifications. Unlike DashboardShell, this does not redirect admins away:
 * it picks ADMIN_NAV + the admin brand for them and NAV_BY_ROLE[role] for
 * everyone else, so there's exactly one physical page per route with no
 * role redirected into a dead end. */
export function SharedShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isInitialized, hydrate, logout } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) hydrate();
  }, [isInitialized, hydrate]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (user.role && user.role !== "admin" && !user.onboarding_completed) {
      router.replace(`/onboarding/${user.role}`);
    } else if (!user.role) {
      router.replace("/onboarding/choose-role");
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user || !user.role) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface-variant text-body-md">
        Loading…
      </div>
    );
  }

  const isAdmin = user.role === "admin";
  const config = BRAND_BY_ROLE[user.role];
  const navItems = isAdmin ? ADMIN_NAV : NAV_BY_ROLE[user.role];

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        brand={config.brand}
        tagline={config.tagline}
        navItems={navItems}
        ctaLabel={isAdmin ? undefined : config.ctaLabel}
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
