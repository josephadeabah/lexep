"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";

export default function UpgradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan") || "learner_plus";
  const user = useAuthStore((s) => s.user);

  const config = useAsync(() => api.getConfig(), []);
  const plans = useAsync(() => api.listPlans(), []);
  const [cycle, setCycle] = useState<"monthly" | "annual">("annual");

  const plan = plans.data?.find((p) => p.id === requestedPlan) ?? plans.data?.[0];

  if (config.isLoading || plans.isLoading) {
    return (
      <div className="text-body-md text-on-surface-variant flex min-h-screen items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!config.data?.premium_features_enabled) {
    return (
      <div className="bg-surface px-gutter flex min-h-screen items-center justify-center">
        <div className="card-level1 p-md max-w-md text-center">
          <div className="flex justify-center">
            <Logo variant="light" />
          </div>
          <h1 className="text-headline-lg text-on-background mt-4">Premium isn&apos;t live yet</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            We&apos;re currently in free beta — every feature is unlocked for everyone, no upgrade
            needed. We&apos;ll let you know when premium plans go live.
          </p>
          <Button className="mt-md" href={user ? "/dashboard" : "/"}>
            {user ? "Back to Dashboard" : "Back Home"}
          </Button>
        </div>
      </div>
    );
  }

  if (!plan || plan.is_custom) {
    return (
      <div className="text-body-md text-on-surface-variant flex min-h-screen items-center justify-center">
        Contact sales for Enterprise pricing.
      </div>
    );
  }

  const price = cycle === "annual" ? plan.annual_price! : plan.monthly_price! * 12;

  return (
    <div className="bg-[#fbf9f8] px-4 py-12 sm:px-6">
      <div className="mx-auto w-full max-w-lg">
        <div className="rounded-2xl border border-[#e0d8c9] bg-white p-8 shadow-sm">
          {/* Header */}
          <div className="text-center">
            <h2 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
              Upgrade to Professional
            </h2>
            <p className="mx-auto mt-2 max-w-md text-base text-[#6d6a66]">
              Unlock advanced features and dedicated support to accelerate your learning journey.
            </p>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1 rounded-full bg-[#f5f3f3] p-1">
              <button
                onClick={() => setCycle("monthly")}
                className={cn(
                  "rounded-full px-5 py-2 text-sm font-semibold transition",
                  cycle === "monthly"
                    ? "bg-[#1b1c1c] text-white"
                    : "text-[#6d6a66] hover:text-[#1b1c1c]"
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setCycle("annual")}
                className={cn(
                  "flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition",
                  cycle === "annual"
                    ? "bg-[#1b1c1c] text-white"
                    : "text-[#6d6a66] hover:text-[#1b1c1c]"
                )}
              >
                Annually
                <span className="rounded-full bg-[#d4af37] px-2 py-0.5 text-xs font-bold text-[#1b1c1c]">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Plan Details */}
          <div className="mt-8 rounded-xl border border-[#e0d8c9] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  {plan.name}
                </p>
                <p className="mt-1 text-sm text-[#6d6a66]">Billed {cycle}</p>
              </div>
              <p className="font-['Hanken_Grotesk'] text-3xl font-bold text-[#1b1c1c]">
                ${price}{" "}
                <span className="text-sm font-normal text-[#6d6a66]">
                  / {cycle === "annual" ? "year" : "month"}
                </span>
              </p>
            </div>

            <div className="mt-6 border-t border-[#e0d8c9]/40 pt-6">
              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-base text-[#1b1c1c]">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#d4af37]">
                      <Check className="h-3.5 w-3.5 text-[#d4af37]" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Action Button */}
          <Button
            className="mt-8 w-full"
            size="lg"
            onClick={() => router.push(`/checkout?plan=${plan.id}&cycle=${cycle}`)}
          >
            Complete Upgrade <ArrowRight className="h-4 w-4" />
          </Button>

          {/* Cancel Link */}
          <Link
            href="/dashboard"
            className="mt-4 block text-center text-sm text-[#6d6a66] hover:text-[#735c00]"
          >
            Cancel
          </Link>

          {/* Terms */}
          <p className="mt-4 text-center text-xs text-[#6d6a66]">
            By upgrading, you agree to our{" "}
            <Link href="/help" className="underline">
              Terms of Service
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}