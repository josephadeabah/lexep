"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, CreditCard, Wallet, Landmark, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api, ApiError } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";

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
    <div className="bg-surface min-h-screen">
      <header className="border-outline-variant/40 px-gutter flex items-center justify-between border-b py-4">
        <Logo variant="light" />
        <span className="text-label-md text-on-surface-variant flex items-center gap-2">
          <Lock className="h-4 w-4" /> Secure Checkout
        </span>
      </header>

      <div className="gap-md px-gutter py-xl mx-auto grid max-w-4xl md:grid-cols-2">
        <div className="card-level1 p-md h-fit">
          <h1 className="text-headline-lg text-on-background">Upgrade Summary</h1>
          <div className="mt-md flex items-start gap-3">
            <span className="bg-surface-container-high flex h-12 w-12 items-center justify-center rounded-md">
              <ShieldCheck className="text-primary h-5 w-5" />
            </span>
            <div>
              <p className="text-headline-md text-on-background">Lexep {plan?.name ?? "Plan"}</p>
              <p className="text-body-md text-on-surface-variant">
                {cycle === "annual" ? "Annual" : "Monthly"} subscription. Includes advanced
                mentorship matching, premium resources, and dedicated support.
              </p>
            </div>
          </div>

          <div className="mt-md border-outline-variant/40 pt-md text-body-md flex flex-col gap-2 border-t">
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Subtotal</span>
              <span className="text-on-background">${price}.00</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Discount (Annual)</span>
                <span className="text-primary">-${discount}.00</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-on-surface-variant">Tax</span>
              <span className="text-on-background">$0.00</span>
            </div>
          </div>

          <div className="mt-md border-outline-variant/40 pt-md flex items-center justify-between border-t">
            <span className="text-headline-md text-on-background">Total</span>
            <span className="text-headline-lg text-on-background">${total}.00</span>
          </div>

          <p className="mt-md text-label-sm text-on-surface-variant flex items-center justify-center gap-2">
            <Lock className="h-3.5 w-3.5" /> Encrypted &amp; Secure Payment
          </p>
        </div>

        <form onSubmit={handlePay} className="card-level1 p-md">
          <h2 className="text-headline-lg text-on-background">Payment Details</h2>

          <div className="mt-md grid grid-cols-3 gap-3">
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
                  "flex flex-col items-center gap-2 rounded-md border p-4 transition",
                  method === m.id
                    ? "border-primary-container bg-surface-container-low"
                    : "border-outline-variant"
                )}
              >
                <m.icon className="text-on-surface h-5 w-5" />
                <span className="text-label-md text-on-surface">{m.label}</span>
              </button>
            ))}
          </div>

          <p className="mt-md text-label-md text-on-surface">Billing Information</p>
          <div className="mt-2 grid grid-cols-2 gap-3">
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

          {method === "card" && (
            <>
              <p className="mt-md text-label-md text-on-surface">Card Details</p>
              <div className="mt-2">
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

          {error && <p className="text-label-sm text-error mt-3">{error}</p>}

          <Button type="submit" size="lg" className="mt-md w-full" disabled={isSubmitting}>
            <Lock className="h-4 w-4" /> {isSubmitting ? "Processing…" : `Pay $${total}.00`}
          </Button>
          <p className="text-label-sm text-on-surface-variant mt-3 text-center">
            By confirming your subscription, you allow Lexep to charge you for future payments in
            accordance with their terms.
          </p>
        </form>
      </div>
    </div>
  );
}
