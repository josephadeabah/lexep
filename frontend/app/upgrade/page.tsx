import { Suspense } from "react";
import UpgradeContent from "./UpgradeContent";

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-body-md text-on-surface-variant">
          Loading…
        </div>
      }
    >
      <UpgradeContent />
    </Suspense>
  );
}
