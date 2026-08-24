"use client";

import { getOutbox, removeFromOutbox } from "./db";
import { getToken } from "../api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export type SyncListener = (state: {
  syncing: boolean;
  pending: number;
  lastError: string | null;
}) => void;

let listeners: SyncListener[] = [];
let isSyncing = false;

export function onSyncStateChange(listener: SyncListener) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

async function notify(lastError: string | null = null) {
  const pending = (await getOutbox()).length;
  listeners.forEach((l) => l({ syncing: isSyncing, pending, lastError }));
}

/** Replays every queued mutation in order, oldest first. Stops at the first
 * failure (keeping it and everything after it queued) so ordering is never
 * violated — e.g. "apply to internship" always replays before a later
 * "withdraw application" for the same item. */
export async function flushOutbox(): Promise<void> {
  if (isSyncing) return;
  if (typeof navigator !== "undefined" && !navigator.onLine) return;

  isSyncing = true;
  await notify();

  try {
    const items = await getOutbox();
    for (const item of items) {
      try {
        const token = getToken();
        const res = await fetch(`${API_URL}${item.url}`, {
          method: item.method,
          headers: {
            ...item.headers,
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            "Idempotency-Key": item.id,
          },
          body: item.body ?? undefined,
        });
        if (!res.ok && res.status >= 500) {
          // Transient server issue — stop here, retry the whole batch later.
          await notify(`Sync paused: server error on "${item.description}".`);
          return;
        }
        // 2xx or a 4xx (e.g. already-applied) both mean "don't retry this one".
        await removeFromOutbox(item.id);
      } catch {
        // Network dropped mid-flush — stop, we'll retry on the next online event.
        await notify("Sync paused: connection lost.");
        return;
      }
    }
    await notify();
  } finally {
    isSyncing = false;
    await notify();
  }
}

export function initOfflineSync() {
  if (typeof window === "undefined") return;
  window.addEventListener("online", () => {
    flushOutbox();
  });
  if (navigator.onLine) {
    flushOutbox();
  }
}
