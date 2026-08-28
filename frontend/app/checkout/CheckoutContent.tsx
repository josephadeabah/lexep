"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CreditCard, Wallet, Landmark, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { useAuthStore } from "@/lib/auth-store";
import Link from "next/link";

type PaymentMethod = "card" | "paypal" | "paystack";

export default function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planId = searchParams.get("plan") || "learner_plus";
  const cycle = (searchParams.get("cycle") as "monthly" | "annual") || "annual";
  const user = useAuthStore((s) => s.user);

  const plans = useAsync(() => api.listPlans(), []);
  const plan = plans.data?.find((p) => p.id === planId);

  const [method, setMethod] = useState<PaymentMethod>("card");
  const [firstName, setFirstName] = useState(user?.full_name.split(" ")[0] ?? "");
  const [lastName, setLastName] = useState(user?.full_name.split(" ").slice(1).join(" ") ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const price = plan ? (cycle === "annual" ? plan.annual_price! : plan.monthly_price! * 12) : 0;
  const discount = cycle === "annual" && plan ? Math.round(plan.monthly_price! * 12 * 0.2) : 0;
  const total = price - discount;

  async function handlePay(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const checkout = await api.checkoutSubscription(planId, cycle);
      if (checkout.authorization_url) {
        window.location.href = checkout.authorization_url;
        return;
      }
      // Mock provider: verify immediately.
      await api.verifyPayment(checkout.reference);
      router.push("/upgrade/success");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Payment failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-[#e0d8c9]/40 bg-white px-6 py-4">
        <Link href="/" className="font-['Hanken_Grotesk'] text-xl font-bold text-[#735c00]">
          Lexep
        </Link>
        <span className="flex items-center gap-2 text-sm text-[#6d6a66]">
          <Lock className="h-4 w-4" /> Secure Checkout
        </span>
      </header>

      <div className="mx-auto grid max-w-4xl gap-6 px-4 py-12 md:grid-cols-2">
        {/* Left: Upgrade Summary */}
        <div className="h-fit rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
            Upgrade Summary
          </h2>

          <div className="mt-6 flex items-start gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f3f3]">
              <ShieldCheck className="h-5 w-5 text-[#735c00]" />
            </span>
            <div>
              <p className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                Lexep {plan?.name ?? "Plan"}
              </p>
              <p className="mt-1 text-sm text-[#6d6a66]">
                {cycle === "annual" ? "Annual" : "Monthly"} subscription. Includes advanced
                mentorship matching, premium resources, and dedicated support.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-[#e0d8c9]/40 pt-6 text-base">
            <div className="flex justify-between">
              <span className="text-[#6d6a66]">Subtotal</span>
              <span className="font-semibold text-[#1b1c1c]">${price}.00</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-[#6d6a66]">Discount (Annual)</span>
                <span className="font-semibold text-[#735c00]">-${discount}.00</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#6d6a66]">Tax</span>
              <span className="font-semibold text-[#1b1c1c]">$0.00</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
            <span className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
              Total
            </span>
            <span className="font-['Hanken_Grotesk'] text-3xl font-bold text-[#1b1c1c]">
              ${total}.00
            </span>
          </div>

          <p className="mt-6 flex items-center justify-center gap-2 text-xs text-[#6d6a66]">
            <Lock className="h-3.5 w-3.5" /> Encrypted &amp; Secure Payment
          </p>
        </div>

        {/* Right: Payment Details */}
        <form onSubmit={handlePay} className="rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
            Payment Details
          </h2>

          {/* Payment Method */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {(
              [
                { id: "card", label: "Card", icon: CreditCard },
                { id: "paypal", label: "PayPal", icon: Wallet },
                { id: "paystack", label: "Paystack", icon: Landmark },
              ] as const
            ).map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setMethod(m.id)}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-lg border p-4 transition",
                  method === m.id
                    ? "border-[#d4af37] bg-[#fffdf8]"
                    : "border-[#e0d8c9] hover:border-[#d4af37]"
                )}
              >
                {/* Radio indicator */}
                <span
                  className={cn(
                    "absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full border",
                    method === m.id
                      ? "border-[#d4af37]"
                      : "border-[#e0d8c9]"
                  )}
                >
                  {method === m.id && (
                    <span className="h-2 w-2 rounded-full bg-[#d4af37]" />
                  )}
                </span>

                <m.icon className={cn("h-5 w-5", method === m.id ? "text-[#d4af37]" : "text-[#6d6a66]")} />
                <span className="text-sm font-medium text-[#1b1c1c]">{m.label}</span>
              </button>
            ))}
          </div>

          {/* Billing Information */}
          <p className="mt-6 text-sm font-semibold text-[#1b1c1c]">Billing Information</p>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              placeholder="Jane"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <div className="mt-3">
            <Input
              label="Email Address"
              type="email"
              placeholder="jane.doe@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Card Details */}
          {method === "card" && (
            <>
              <p className="mt-6 text-sm font-semibold text-[#1b1c1c]">Card Details</p>
              <div className="mt-3">
                <Input
                  label="Card Number"
                  placeholder="0000 0000 0000 0000"
                  icon={<CreditCard className="h-4 w-4" />}
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <Input
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                />
                <Input
                  label="CVC"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                />
              </div>
            </>
          )}

          {error && <p className="mt-3 text-sm text-[#ba1a1a]">{error}</p>}

          <Button
            type="submit"
            size="lg"
            className="mt-8 w-full bg-[#d4af37] font-semibold text-[#1b1c1c] hover:bg-[#c9a32e]"
            disabled={isSubmitting}
          >
            <Lock className="h-4 w-4" /> {isSubmitting ? "Processing…" : `Pay $${total}.00`}
          </Button>
          <p className="mt-4 text-center text-xs text-[#6d6a66]">
            By confirming your subscription, you allow Lexep to charge you for future payments in
            accordance with their terms.
          </p>
        </form>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#e0d8c9]/40 bg-white px-6 py-6">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-4 text-sm text-[#6d6a66] sm:flex-row">
          <span className="font-['Hanken_Grotesk'] text-lg font-bold text-[#735c00]">Lexep</span>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#735c00]">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[#735c00]">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-[#735c00]">
              Contact Support
            </Link>
          </div>
          <span>© 2024 Lexep. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}