"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { useOnlineStatus } from "@/lib/offline/useOnlineStatus";

export function OfflineBanner() {
  const { isOnline, pending, syncing } = useOnlineStatus();

  if (isOnline && pending === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-inverse-surface px-gutter py-2 text-center text-label-sm text-inverse-on-surface">
      {!isOnline ? (
        <>
          <WifiOff className="h-3.5 w-3.5" />
          You&apos;re offline — changes you make will be saved and synced automatically once you&apos;re back online.
        </>
      ) : syncing ? (
        <>
          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
          Syncing {pending} pending change{pending === 1 ? "" : "s"}…
        </>
      ) : (
        <>
          <RefreshCw className="h-3.5 w-3.5" />
          {pending} change{pending === 1 ? "" : "s"} waiting to sync.
        </>
      )}
    </div>
  );
}
