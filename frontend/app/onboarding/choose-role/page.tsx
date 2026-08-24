"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Compass, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";

const ROLES: { id: UserRole; title: string; description: string; icon: typeof GraduationCap }[] = [
  {
    id: "learner",
    title: "Learner",
    description: "I want to learn and grow.",
    icon: GraduationCap,
  },
  { id: "mentor", title: "Mentor", description: "I want to guide and inspire.", icon: Compass },
  {
    id: "company",
    title: "Company",
    description: "I want to find and hire talent.",
    icon: Building2,
  },
];

export default function ChooseRolePage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [selected, setSelected] = useState<UserRole | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleContinue() {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      const user = await api.chooseRole(selected);
      setUser(user);
      router.push(`/onboarding/${selected}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <header className="border-b border-outline-variant/40 py-4 text-center">
        <span className="text-headline-md text-primary">Lexep</span>
      </header>

      <div className="mx-auto max-w-3xl px-gutter py-xl text-center">
        <h1 className="text-headline-lg text-on-background">Choose your journey</h1>
        <p className="mx-auto mt-3 max-w-xl text-body-md text-on-surface-variant">
          Select the path that best describes your goals on Lexep. This helps us tailor your
          experience.
        </p>

        <div className="mt-lg grid gap-md sm:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const active = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={cn(
                  "card-level1 flex flex-col items-start gap-4 p-md text-left transition",
                  active ? "ring-2 ring-primary-container" : "hover:shadow-level2"
                )}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-high">
                  <Icon className="h-5 w-5 text-on-surface" />
                </span>
                <div>
                  <p className="text-headline-md text-on-background">{role.title}</p>
                  <p className="mt-1 text-body-md text-on-surface-variant">{role.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selected || isSubmitting}
          size="lg"
          className="mt-lg"
          variant={selected ? "primary" : "ghost"}
        >
          {isSubmitting ? "Saving…" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
