"use client";

import { useEffect } from "react";
import { initOfflineSync } from "@/lib/offline/sync";

export function OfflineProvider() {
  useEffect(() => {
    initOfflineSync();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Offline shell caching is a progressive enhancement — if
        // registration fails (e.g. unsupported browser), the app still
        // works normally online, it just won't have offline page caching.
      });
    }
  }, []);

  return null;
}
