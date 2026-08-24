"use client";

/**
 * Minimal IndexedDB wrapper for offline support. No external dependency —
 * just the two object stores this app actually needs:
 *
 *  - `outbox`: mutating requests (POST/PUT/PATCH/DELETE) made while offline,
 *    queued in order and replayed once connectivity returns (see sync.ts).
 *  - `cache`: best-effort snapshots of successful GET responses, so key
 *    listing screens (opportunities, mentors, grants) can still render
 *    something useful while offline instead of a blank error state.
 *
 * Every queued mutation carries a client-generated idempotency key that the
 * backend's IdempotencyMiddleware uses to guarantee a replay can never
 * create a duplicate row, even if the same item gets flushed twice (e.g.
 * the browser closes mid-sync and retries on next load).
 */

const DB_NAME = "lexep-offline";
const DB_VERSION = 1;
export const OUTBOX_STORE = "outbox";
export const CACHE_STORE = "cache";

export interface OutboxItem {
  id: string; // == idempotencyKey
  url: string;
  method: string;
  body: string | null;
  headers: Record<string, string>;
  createdAt: number;
  description: string; // human-readable, for the "pending changes" UI
}

function isBrowser() {
  return typeof window !== "undefined" && "indexedDB" in window;
}

function openDb(): Promise<IDBDatabase | null> {
  if (!isBrowser()) return Promise.resolve(null);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(OUTBOX_STORE)) {
        db.createObjectStore(OUTBOX_STORE, { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains(CACHE_STORE)) {
        db.createObjectStore(CACHE_STORE, { keyPath: "key" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addToOutbox(item: OutboxItem): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, "readwrite");
    tx.objectStore(OUTBOX_STORE).put(item);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getOutbox(): Promise<OutboxItem[]> {
  const db = await openDb();
  if (!db) return [];
  return new Promise((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, "readonly");
    const req = tx.objectStore(OUTBOX_STORE).getAll();
    req.onsuccess = () => resolve((req.result as OutboxItem[]).sort((a, b) => a.createdAt - b.createdAt));
    req.onerror = () => reject(req.error);
  });
}

export async function removeFromOutbox(id: string): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(OUTBOX_STORE, "readwrite");
    tx.objectStore(OUTBOX_STORE).delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function cacheGet(key: string): Promise<unknown | null> {
  const db = await openDb();
  if (!db) return null;
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CACHE_STORE, "readonly");
    const req = tx.objectStore(CACHE_STORE).get(key);
    req.onsuccess = () => resolve(req.result ? req.result.value : null);
    req.onerror = () => reject(req.error);
  });
}

export async function cacheSet(key: string, value: unknown): Promise<void> {
  const db = await openDb();
  if (!db) return;
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(CACHE_STORE, "readwrite");
    tx.objectStore(CACHE_STORE).put({ key, value, cachedAt: Date.now() });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
