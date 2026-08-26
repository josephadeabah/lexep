"use client";

import { CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/Button";

const UNLOCKED = [
  "Advanced Analytics Dashboard",
  "Priority 24/7 Support Access",
  "Unlimited Project Workspaces",
];

export default function UpgradeSuccessPage() {
  return (
    <div className="bg-surface px-gutter py-xl flex min-h-screen items-center justify-center">
      <div className="card-level1 gap-md p-md grid w-full max-w-2xl sm:grid-cols-[160px_1fr] sm:items-center">
        <div className="bg-surface-container-high mx-auto flex h-32 w-32 items-center justify-center rounded-full">
          <Award className="text-primary-container h-14 w-14" />
        </div>
        <div>
          <h1 className="text-headline-lg text-on-background">Welcome to Lexep Pro</h1>
          <p className="text-body-md text-on-surface-variant mt-2">
            Your upgrade was successful. You now have full access to our premium suite of tools.
          </p>

          <div className="mt-md border-outline-variant p-md rounded-md border">
            <p className="text-label-md text-on-background">Now Unlocked:</p>
            <ul className="mt-2 flex flex-col gap-2">
              {UNLOCKED.map((item) => (
                <li key={item} className="text-body-md text-on-surface flex items-center gap-2">
                  <CheckCircle2 className="text-primary h-4 w-4" /> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-md flex flex-col gap-2 sm:flex-row">
            <Button href="/dashboard">Go to Dashboard</Button>
            <Button href="/dashboard" variant="secondary">
              Explore Pro Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
