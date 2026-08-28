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
    <div className="flex min-h-screen items-center justify-center bg-[#fbf9f8] px-4 py-12">
      <div className="grid w-full max-w-2xl gap-8 rounded-2xl bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.04)] sm:grid-cols-[160px_1fr] sm:items-center sm:gap-12 sm:p-12">
        {/* Icon */}
        <div className="mx-auto flex h-32 w-32 items-center justify-center rounded-full bg-[#f5f3f3]">
          <Award className="h-14 w-14 text-[#d4af37]" />
        </div>

        {/* Content */}
        <div>
          <h2 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.045em] text-[#1b1c1c] sm:text-4xl">
            Welcome to Lexep Pro
          </h2>
          <p className="mt-2 text-base text-[#6d6a66]">
            Your upgrade was successful. You now have full access to our premium suite of tools.
          </p>

          {/* Unlocked Features */}
          <div className="mt-6 rounded-xl bg-[#f5f3f3] p-6">
            <p className="text-sm font-semibold text-[#1b1c1c]">Now Unlocked:</p>
            <ul className="mt-3 flex flex-col gap-3">
              {UNLOCKED.map((item) => (
                <li key={item} className="flex items-center gap-3 text-base text-[#1b1c1c]">
                  <CheckCircle2 className="h-5 w-5 text-[#735c00]" /> {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button href="/dashboard" className="bg-[#d4af37] font-semibold text-[#1b1c1c] hover:bg-[#c9a32e]">
              Go to Dashboard
            </Button>
            <Button href="/dashboard" variant="outline" className="border-[#e0d8c9]">
              Explore Pro Features
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}