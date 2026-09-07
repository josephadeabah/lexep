"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";

interface RoleGuardProps {
  /** Roles allowed to view this page's content. */
  allow: UserRole[];
  /** Where to send the user if they're authenticated but not allowed.
   * Defaults to /dashboard, which is itself role-aware. */
  redirectTo?: string;
  children: React.ReactNode;
}

/** Wraps a page's content and enforces a role check on the frontend to
 * match the backend's require_role guard on the corresponding endpoint(s).
 * Without this, a user with the wrong role could still see the page shell
 * (forms, buttons) even though every submission would 403 — this redirects
 * them away before that ever renders.
 *
 * Use this for pages *not* already covered by DashboardShell/AdminShell's
 * own role redirects (e.g. a company-only page reachable at a URL other
 * roles could otherwise navigate to directly). */
export function RoleGuard({ allow, redirectTo = "/dashboard", children }: RoleGuardProps) {
  const router = useRouter();
  const { user, isInitialized, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) hydrate();
  }, [isInitialized, hydrate]);

  useEffect(() => {
    if (!isInitialized) return;
    if (!user) {
      router.replace("/sign-in");
    } else if (!user.role || !allow.includes(user.role)) {
      router.replace(redirectTo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized, user, router]);

  if (!isInitialized || !user || !user.role || !allow.includes(user.role)) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface-variant text-body-md">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
