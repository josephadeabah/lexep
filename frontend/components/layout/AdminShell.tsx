"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import { Sidebar } from "./Sidebar";
import { OfflineBanner } from "./OfflineBanner";
import { ADMIN_NAV } from "@/lib/nav-config";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
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
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface-variant text-body-md">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <Sidebar
        brand="Lexep Admin"
        tagline="Platform Management"
        navItems={ADMIN_NAV}
        ctaLabel=""
        userSummary={{ name: user.full_name, roleLabel: "Admin" }}
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
