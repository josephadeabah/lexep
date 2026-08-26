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
    <div className="bg-surface px-gutter py-xl flex min-h-screen items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="card-level1 p-md">
          <div className="text-center">
            <h1 className="text-headline-lg text-on-background">Upgrade to Professional</h1>
            <p className="text-body-md text-on-surface-variant mt-2">
              Unlock advanced features and dedicated support to accelerate your learning journey.
            </p>
          </div>

          <div className="mt-md bg-surface-container-low mx-auto flex w-fit items-center gap-1 rounded-full p-1">
            <button
              onClick={() => setCycle("monthly")}
              className={cn(
                "text-label-md rounded-full px-4 py-2 transition",
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
                "text-label-md flex items-center gap-2 rounded-full px-4 py-2 transition",
                cycle === "annual"
                  ? "bg-inverse-surface text-inverse-on-surface"
                  : "text-on-surface-variant"
              )}
            >
              Annually
              <span className="bg-primary-fixed text-label-sm text-on-primary-fixed-variant rounded-full px-2 py-0.5">
                Save 20%
              </span>
            </button>
          </div>

          <div className="mt-md border-outline-variant p-md rounded-md border">
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
            <ul className="mt-md border-outline-variant/40 pt-md flex flex-col gap-3 border-t">
              {plan.features.map((f) => (
                <li key={f} className="text-body-md text-on-surface flex items-center gap-2">
                  <Check className="text-primary h-4 w-4" /> {f}
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
            className="text-label-md text-on-surface-variant hover:text-primary mt-3 block text-center"
          >
            Cancel
          </Link>
          <p className="text-label-sm text-on-surface-variant mt-3 text-center">
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
