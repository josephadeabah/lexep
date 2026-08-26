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
    <div className="bg-background min-h-screen">
      <header className="border-outline-variant/40 border-b">
        <div className="max-w-container-max px-gutter mx-auto flex items-center justify-between py-4">
          <Link href="/">
            <Logo variant="light" />
          </Link>
          <nav className="gap-lg hidden items-center md:flex">
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

      <div className="max-w-container-max px-gutter py-xl mx-auto text-center">
        <h1 className="text-display-lg text-on-background" style={{ fontSize: 48 }}>
          Invest in your architectural future.
        </h1>
        <p className="text-body-lg text-on-surface-variant mx-auto mt-4 max-w-2xl">
          Choose the plan that accelerates your career, whether you&apos;re a student building a
          portfolio, an expert sharing knowledge, or an enterprise sourcing top talent.
        </p>

        {!premiumEnabled && (
          <div className="bg-primary-fixed text-label-md text-on-primary-fixed-variant mx-auto mt-6 inline-block rounded-full px-4 py-2">
            🎉 All plans are free during our beta — no card required.
          </div>
        )}

        <div className="mt-xl gap-md grid md:grid-cols-3">
          {plans.isLoading ? (
            <p className="text-body-md text-on-surface-variant">Loading plans…</p>
          ) : (
            plans.data?.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "p-md relative rounded-lg border text-left",
                  plan.is_popular ? "border-primary-container border-2" : "border-outline-variant"
                )}
              >
                {plan.is_popular && (
                  <span className="bg-primary-fixed text-label-sm text-on-primary-fixed-variant absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1">
                    Most Popular
                  </span>
                )}
                <h2 className="text-headline-md text-on-background">{plan.name}</h2>
                <p className="text-body-md text-on-surface-variant mt-2">{plan.audience}</p>
                <p
                  className="text-display-lg text-on-background mt-4"
                  style={{ fontSize: plan.is_custom ? 40 : 48 }}
                >
                  {plan.is_custom ? "Custom" : `$${plan.monthly_price}`}
                  {!plan.is_custom && (
                    <span className="text-body-lg text-on-surface-variant">/month</span>
                  )}
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="text-body-md text-on-surface flex items-start gap-2">
                      <CheckCircle2 className="text-primary mt-0.5 h-4 w-4 flex-shrink-0" /> {f}
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
