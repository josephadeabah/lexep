"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { OfflineBanner } from "./OfflineBanner";
import { useAuthStore } from "@/lib/auth-store";
import { NAV_BY_ROLE } from "@/lib/nav-config";
import type { UserRole } from "@/lib/types";

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
    brand: "Architect Portal",
    tagline: "Empowering African Youth",
    roleLabel: "Admin",
  },
};

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
      <div className="bg-surface text-body-md text-on-surface-variant flex h-screen items-center justify-center">
        Loading your workspace…
      </div>
    );
  }

  const role = user.role;
  const config = BRAND_BY_ROLE[role];

  return (
    <div className="bg-surface flex min-h-screen">
      <Sidebar
        brand={config.brand}
        tagline={config.tagline}
        navItems={NAV_BY_ROLE[role]}
        ctaLabel={config.ctaLabel}
        ctaHref={config.ctaHref}
        userSummary={{
          name: user.full_name,
          roleLabel: config.roleLabel,
          avatarUrl: user.avatar_url,
        }}
        onLogout={() => {
          logout();
          router.replace("/sign-in");
        }}
      />
      <main className="flex-1 overflow-y-auto">
        <OfflineBanner />
        <div className="px-md py-lg md:px-xl md:py-xl">
          <div className="max-w-container-max mx-auto w-full">{children}</div>
        </div>
      </main>
    </div>
  );
}
