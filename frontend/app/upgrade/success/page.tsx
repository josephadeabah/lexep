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
    <div className="flex min-h-screen items-center justify-center bg-surface px-gutter py-xl">
      <div className="card-level1 grid w-full max-w-2xl gap-md p-md sm:grid-cols-[160px_1fr] sm:items-center">
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-surface-container-high">
          <Award className="h-14 w-14 text-primary-container" />
        </div>
        <div>
          <h1 className="text-headline-lg text-on-background">Welcome to Lexep Pro</h1>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Your upgrade was successful. You now have full access to our premium suite of tools.
          </p>

          <div className="mt-md rounded-md border border-outline-variant p-md">
            <p className="text-label-md text-on-background">Now Unlocked:</p>
            <ul className="mt-2 flex flex-col gap-2">
              {UNLOCKED.map((item) => (
                <li key={item} className="flex items-center gap-2 text-body-md text-on-surface">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {item}
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
