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
    <div className="min-h-screen bg-[#fbf9f8]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        {/* Header - explicitly centered */}
        <div className="text-center">
          <h2 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c] sm:text-5xl">
            Choose your journey
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-[#6d6a66]">
            Select the path that best describes your goals on Lexep. This helps us tailor your
            experience.
          </p>
        </div>

        {/* Role Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const active = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={cn(
                  "flex flex-col items-start gap-4 rounded-xl border bg-white p-8 text-left transition-all",
                  active
                    ? "border-[#d4af37] bg-[#fffdf8] shadow-[0_0_0_3px_rgba(212,175,55,0.1)]"
                    : "border-[#e0d8c9] hover:border-[#d4af37] hover:shadow-md"
                )}
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f3f3]">
                  <Icon className="h-6 w-6 text-[#1b1c1c]" />
                </span>
                <div>
                  <p className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                    {role.title}
                  </p>
                  <p className="mt-1 text-sm text-[#6d6a66]">{role.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="mt-12 flex justify-center">
          <Button
            onClick={handleContinue}
            disabled={!selected || isSubmitting}
            size="lg"
            variant={selected ? "primary" : "ghost"}
            className={selected ? "" : "bg-[#f0f0f0] text-[#6d6a66]"}
          >
            {isSubmitting ? "Saving…" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}