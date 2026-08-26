import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="text-body-md text-on-surface-variant flex min-h-screen items-center justify-center">
          Loading…
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
