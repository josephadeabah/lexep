"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

/** For pages that need to be authenticated but intentionally render their
 * own full-bleed layout without the app sidebar (e.g. the fullscreen quiz
 * UI). For anything that should show the normal sidebar, use DashboardShell
 * or SharedShell instead. */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isInitialized, hydrate } = useAuthStore();

  useEffect(() => {
    if (!isInitialized) hydrate();
  }, [isInitialized, hydrate]);

  useEffect(() => {
    if (isInitialized && !user) router.replace("/sign-in");
  }, [isInitialized, user, router]);

  if (!isInitialized || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-surface text-on-surface-variant text-body-md">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}
