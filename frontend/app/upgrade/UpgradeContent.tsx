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
      <div className="flex min-h-screen items-center justify-center text-body-md text-on-surface-variant">
        Loading…
      </div>
    );
  }

  if (!config.data?.premium_features_enabled) {
    return (
      <div className="px-gutter flex min-h-screen items-center justify-center bg-surface">
        <div className="card-level1 max-w-md p-md text-center">
          <div className="flex justify-center">
            <Logo variant="light" />
          </div>
          <h1 className="mt-4 text-headline-lg text-on-background">Premium isn&apos;t live yet</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
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
      <div className="flex min-h-screen items-center justify-center text-body-md text-on-surface-variant">
        Contact sales for Enterprise pricing.
      </div>
    );
  }

  const price = cycle === "annual" ? plan.annual_price! : plan.monthly_price! * 12;

  return (
    <div className="px-gutter flex min-h-screen items-center justify-center bg-surface py-xl">
      <div className="w-full max-w-lg">
        <div className="card-level1 p-md">
          <div className="text-center">
            <h1 className="text-headline-lg text-on-background">Upgrade to Professional</h1>
            <p className="mt-2 text-body-md text-on-surface-variant">
              Unlock advanced features and dedicated support to accelerate your learning journey.
            </p>
          </div>

          <div className="mx-auto mt-md flex w-fit items-center gap-1 rounded-full bg-surface-container-low p-1">
            <button
              onClick={() => setCycle("monthly")}
              className={cn(
                "rounded-full px-4 py-2 text-label-md transition",
                cycle === "monthly"
                  ? "bg-inverse-surface text-inverse-on-surface"
                  : "text-on-surface-variant"
              )}
            >
              Monthly
            </button>
            <button
              onClick={() => setCycle("annual")}
              className={cn(
                "flex items-center gap-2 rounded-full px-4 py-2 text-label-md transition",
                cycle === "annual"
                  ? "bg-inverse-surface text-inverse-on-surface"
                  : "text-on-surface-variant"
              )}
            >
              Annually
              <span className="rounded-full bg-primary-fixed px-2 py-0.5 text-label-sm text-on-primary-fixed-variant">
                Save 20%
              </span>
            </button>
          </div>

          <div className="mt-md rounded-md border border-outline-variant p-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-label-md text-on-background">{plan.name}</p>
                <p className="text-label-sm text-on-surface-variant">Billed {cycle}</p>
              </div>
              <p className="text-headline-lg text-on-background">
                ${price}{" "}
                <span className="text-label-md text-on-surface-variant">
                  / {cycle === "annual" ? "year" : "month"}
                </span>
              </p>
            </div>
            <ul className="mt-md flex flex-col gap-3 border-t border-outline-variant/40 pt-md">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-body-md text-on-surface">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <Button
            className="mt-md w-full"
            size="lg"
            onClick={() => router.push(`/checkout?plan=${plan.id}&cycle=${cycle}`)}
          >
            Complete Upgrade <ArrowRight className="h-4 w-4" />
          </Button>
          <Link
            href="/dashboard"
            className="mt-3 block text-center text-label-md text-on-surface-variant hover:text-primary"
          >
            Cancel
          </Link>
          <p className="mt-3 text-center text-label-sm text-on-surface-variant">
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
