// frontend/app/checkout/callback/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { api, ApiError } from "@/lib/api";

function CheckoutCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const reference = searchParams.get("reference") || searchParams.get("trxref");

    if (!reference) {
      setStatus("failed");
      setMessage("No payment reference found");
      return;
    }

    const verifyPayment = async () => {
      try {
        const verification = await api.verifyPayment(reference);

        if (verification.status === "success") {
          setStatus("success");
          setMessage("Payment successful! Your subscription is now active.");
          setTimeout(() => {
            router.push("/upgrade/success");
          }, 2000);
        } else {
          setStatus("failed");
          setMessage("Payment was not successful. Please try again.");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        if (error instanceof ApiError) {
          setMessage(error.message);
        } else {
          setMessage("An error occurred while verifying your payment.");
        }
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [router, searchParams]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <h1 className="mt-4 text-headline-md text-on-background">Verifying payment...</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-headline-lg text-on-background">Payment Successful!</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">{message}</p>
          <p className="mt-4 text-label-sm text-on-surface-variant">
            Redirecting to success page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-headline-lg text-on-background">Payment Failed</h1>
        <p className="mt-2 text-body-md text-on-surface-variant">{message}</p>
        <button
          onClick={() => router.push("/upgrade")}
          className="mt-6 rounded-md bg-primary px-6 py-3 text-label-md text-on-primary hover:bg-primary-container"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function CheckoutCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center text-body-md text-on-surface-variant">
          Loading…
        </div>
      }
    >
      <CheckoutCallbackContent />
    </Suspense>
  );
}
