import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center text-body-md text-on-surface-variant">Loading…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
