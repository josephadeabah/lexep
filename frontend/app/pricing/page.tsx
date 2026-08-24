"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { useAuthStore } from "@/lib/auth-store";

export default function PricingPage() {
  const plans = useAsync(() => api.listPlans(), []);
  const config = useAsync(() => api.getConfig(), []);
  const user = useAuthStore((s) => s.user);

  const premiumEnabled = config.data?.premium_features_enabled ?? false;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-outline-variant/40">
        <div className="mx-auto flex max-w-container-max items-center justify-between px-gutter py-4">
          <Link href="/">
            <Logo variant="light" />
          </Link>
          <nav className="hidden items-center gap-lg md:flex">
            <Link href="/" className="text-body-md text-on-surface-variant hover:text-primary">
              Explore
            </Link>
            <Link
              href="/mentorship"
              className="text-body-md text-on-surface-variant hover:text-primary"
            >
              Mentors
            </Link>
            <Link href="/pricing" className="text-body-md text-primary underline">
              Pricing
            </Link>
            <Link
              href="/insights"
              className="text-body-md text-on-surface-variant hover:text-primary"
            >
              About
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {user ? (
              <Button href="/dashboard" variant="primary">
                Dashboard
              </Button>
            ) : (
              <>
                <Button href="/sign-in" variant="ghost">
                  Log In
                </Button>
                <Button href="/sign-up" variant="primary">
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-container-max px-gutter py-xl text-center">
        <h1 className="text-display-lg text-on-background" style={{ fontSize: 48 }}>
          Invest in your architectural future.
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-body-lg text-on-surface-variant">
          Choose the plan that accelerates your career, whether you&apos;re a student building a
          portfolio, an expert sharing knowledge, or an enterprise sourcing top talent.
        </p>

        {!premiumEnabled && (
          <div className="mx-auto mt-6 inline-block rounded-full bg-primary-fixed px-4 py-2 text-label-md text-on-primary-fixed-variant">
            🎉 All plans are free during our beta — no card required.
          </div>
        )}

        <div className="mt-xl grid gap-md md:grid-cols-3">
          {plans.isLoading ? (
            <p className="text-body-md text-on-surface-variant">Loading plans…</p>
          ) : (
            plans.data?.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-lg border p-md text-left",
                  plan.is_popular ? "border-2 border-primary-container" : "border-outline-variant"
                )}
              >
                {plan.is_popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary-fixed px-3 py-1 text-label-sm text-on-primary-fixed-variant">
                    Most Popular
                  </span>
                )}
                <h2 className="text-headline-md text-on-background">{plan.name}</h2>
                <p className="mt-2 text-body-md text-on-surface-variant">{plan.audience}</p>
                <p
                  className="mt-4 text-display-lg text-on-background"
                  style={{ fontSize: plan.is_custom ? 40 : 48 }}
                >
                  {plan.is_custom ? "Custom" : `$${plan.monthly_price}`}
                  {!plan.is_custom && (
                    <span className="text-body-lg text-on-surface-variant">/month</span>
                  )}
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-body-md text-on-surface">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" /> {f}
                    </li>
                  ))}
                </ul>
                <Button
                  href={
                    plan.is_custom
                      ? "/help"
                      : premiumEnabled
                        ? `/upgrade?plan=${plan.id}`
                        : "/sign-up"
                  }
                  variant={plan.is_popular ? "primary" : plan.is_custom ? "ghost" : "secondary"}
                  className="mt-md w-full"
                >
                  {plan.is_custom
                    ? "Contact Sales"
                    : premiumEnabled
                      ? `Start ${plan.name}`
                      : "Get Started Free"}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
