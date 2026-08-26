import { Suspense } from "react";
import UpgradeContent from "./UpgradeContent";

export default function UpgradePage() {
  return (
    <Suspense
      fallback={
        <div className="text-body-md text-on-surface-variant flex min-h-screen items-center justify-center">
          Loading…
        </div>
      }
    >
      <UpgradeContent />
    </Suspense>
  );
}
