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
      <header className="border-b border-[#d8d1c4]">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-5 lg:px-12">
          <Link href="/" className="flex items-center gap-2" aria-label="Lexep home">
            <Logo size={64} showWordmark={false} />
            <span className="font-sans text-xl font-semibold tracking-[-0.04em]">Lexep</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-sm font-semibold text-[#6d6a66] transition hover:text-[#735c00]"
            >
              Explore
            </Link>
            <Link
              href="/mentorship"
              className="text-sm font-semibold text-[#6d6a66] transition hover:text-[#735c00]"
            >
              Mentors
            </Link>
            <Link
              href="/pricing"
              className="border-b-2 border-[#d4af37] pb-0.5 text-sm font-semibold text-[#1b1c1c]"
            >
              Pricing
            </Link>
            <Link
              href="/insights"
              className="text-sm font-semibold text-[#6d6a66] transition hover:text-[#735c00]"
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

      <div className="mx-auto max-w-[1280px] px-6 py-20 text-center lg:px-12 lg:py-24">
        <p className="mb-4 text-xs font-semibold tracking-[0.18em] text-[#735c00] uppercase">
          Pricing
        </p>
        <h1 className="font-sans text-4xl font-bold tracking-[-0.055em] text-[#1b1c1c] sm:text-5xl lg:text-6xl">
          Invest in your architectural future.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-[#5f5e5e]">
          Choose the plan that accelerates your career, whether you&apos;re a student building a
          portfolio, an expert sharing knowledge, or an enterprise sourcing top talent.
        </p>

        {!premiumEnabled && (
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#f7edc9] px-4 py-2 text-sm font-medium text-[#735c00]">
            🎉 All plans are free during our beta — no card required.
          </div>
        )}

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {plans.isLoading ? (
            <p className="text-[#6d6a66]">Loading plans…</p>
          ) : (
            plans.data?.map((plan) => (
              <div
                key={plan.id}
                className={cn(
                  "relative rounded-xl border bg-white p-8 text-left transition-all",
                  plan.is_popular
                    ? "border-2 border-[#d4af37] shadow-[0_18px_50px_rgba(48,48,49,0.14)]"
                    : "border-[#d8d1c4] hover:border-[#735c00]/50"
                )}
              >
                {plan.is_popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#d4af37] px-4 py-1 text-xs font-semibold text-[#241a00] shadow-sm">
                    Most Popular
                  </span>
                )}
                <h2 className="font-sans text-2xl font-semibold tracking-[-0.04em] text-[#1b1c1c]">
                  {plan.name}
                </h2>
                <p className="mt-2 text-sm text-[#6d6a66]">{plan.audience}</p>
                <p className="mt-6 font-sans text-5xl font-bold tracking-[-0.04em] text-[#1b1c1c]">
                  {plan.is_custom ? "Custom" : `$${plan.monthly_price}`}
                  {!plan.is_custom && (
                    <span className="text-base font-normal text-[#6d6a66]">/month</span>
                  )}
                </p>
                <ul className="mt-8 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-[#4d4635]">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#735c00]" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Button
                    href={
                      plan.is_custom
                        ? "/help"
                        : premiumEnabled
                          ? `/upgrade?plan=${plan.id}`
                          : "/sign-up"
                    }
                    variant={plan.is_popular ? "primary" : plan.is_custom ? "ghost" : "secondary"}
                    className="w-full"
                  >
                    {plan.is_custom
                      ? "Contact Sales"
                      : premiumEnabled
                        ? `Start ${plan.name}`
                        : "Get Started Free"}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
