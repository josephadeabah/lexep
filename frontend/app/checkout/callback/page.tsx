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
      <div className="bg-surface flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-primary mx-auto h-12 w-12 animate-spin" />
          <h1 className="text-headline-md text-on-background mt-4">Verifying payment...</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-surface flex min-h-screen items-center justify-center">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="text-headline-lg text-on-background mt-4">Payment Successful!</h1>
          <p className="text-body-md text-on-surface-variant mt-2">{message}</p>
          <p className="text-label-sm text-on-surface-variant mt-4">
            Redirecting to success page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface flex min-h-screen items-center justify-center">
      <div className="text-center">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="text-headline-lg text-on-background mt-4">Payment Failed</h1>
        <p className="text-body-md text-on-surface-variant mt-2">{message}</p>
        <button
          onClick={() => router.push("/upgrade")}
          className="bg-primary text-label-md text-on-primary hover:bg-primary-container mt-6 rounded-md px-6 py-3"
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
        <div className="text-body-md text-on-surface-variant flex min-h-screen items-center justify-center">
          Loading…
        </div>
      }
    >
      <CheckoutCallbackContent />
    </Suspense>
  );
}
