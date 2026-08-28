"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, Compass, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import type { UserRole } from "@/lib/types";
import styles from "../onboarding.module.css";

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
    <div className={styles.shell}>
      <div className={styles.content}>
        <h1 className={styles.title}>Choose your journey</h1>
        <p className={styles.subtitle}>
          Select the path that best describes your goals on Lexep. This helps us tailor your
          experience.
        </p>

        <div className={cn(styles.optionsGrid, styles.optionsGridThree)}>
          {ROLES.map((role) => {
            const Icon = role.icon;
            const active = selected === role.id;
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className={cn(styles.optionCard, active && styles.optionCardSelected)}
              >
                <span className={styles.optionIcon}>
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className={styles.optionTitle}>{role.title}</p>
                  <p className={styles.optionDescription}>{role.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className={styles.footer} style={{ justifyContent: "center" }}>
          <Button
            onClick={handleContinue}
            disabled={!selected || isSubmitting}
            size="lg"
            variant={selected ? "primary" : "ghost"}
          >
            {isSubmitting ? "Saving…" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
