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
  {
    brand: string;
    tagline: string;
    ctaLabel?: string;
    ctaHref?: string;
    roleLabel: string;
  }
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
    if (!isInitialized) {
      hydrate();
    }
  }, [isInitialized, hydrate]);

  useEffect(() => {
    if (!isInitialized) return;

    if (!user) {
      router.replace("/sign-in");
      return;
    }

    if (user.role === "admin") {
      router.replace("/admin/applications");
      return;
    }

    if (!user.role) {
      router.replace("/onboarding/choose-role");
      return;
    }

    if (!user.onboarding_completed) {
      router.replace(`/onboarding/${user.role}`);
    }
  }, [isInitialized, user, router]);

  if (!isInitialized || !user || !user.role || user.role === "admin") {
    return (
      <div className="flex h-dvh items-center justify-center bg-surface text-body-md text-on-surface-variant">
        Loading your workspace…
      </div>
    );
  }

  const role = user.role;
  const config = BRAND_BY_ROLE[role];

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-surface">
      {/* 
        Fixed sidebar.
        This does NOT participate in the main content scroll.
      */}
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

      {/* 
        Desktop spacer.
        The sidebar is fixed, so this reserves its space in the layout.
      */}
      <div className="hidden h-full w-sidebar shrink-0 md:block" />

      {/* 
        This is the ONLY dashboard area that scrolls.
      */}
      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
        <OfflineBanner />

        <div className="min-h-full px-md py-lg md:px-xl md:py-xl">
          <div className="mx-auto w-full max-w-container-max">{children}</div>
        </div>
      </main>
    </div>
  );
}
