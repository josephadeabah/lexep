"use client";

import { useEffect, useState } from "react";
import { onSyncStateChange, initOfflineSync } from "./sync";
import { getOutbox } from "./db";

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [pending, setPending] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);
    initOfflineSync();

    getOutbox().then((items) => setPending(items.length));

    const goOnline = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener("online", goOnline);
    window.addEventListener("offline", goOffline);

    const unsubscribe = onSyncStateChange((state) => {
      setPending(state.pending);
      setSyncing(state.syncing);
    });

    return () => {
      window.removeEventListener("online", goOnline);
      window.removeEventListener("offline", goOffline);
      unsubscribe();
    };
  }, []);

  return { isOnline, pending, syncing };
}
