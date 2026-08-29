"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Globe2, Lock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { api } from "@/lib/api";

export default function CreateGrantGroupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [goal, setGoal] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleCreate() {
    setIsSubmitting(true);
    try {
      const group = await api.createGrantGroup({
        name,
        category,
        goal_amount: goal ? parseFloat(goal) : 0,  // Ensure valid float
        visibility,
      });
      router.push(`/grants/${group.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf9f8] px-4 py-12">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
            Create a Grant Group
          </h1>
          <p className="mt-2 text-base text-[#6d6a66]">
            Establish a dedicated space for targeted community contributions.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-[#e0d8c9] bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6">
            {/* Group Name */}
            <div>
              <Input
                label="Group Name"
                placeholder="e.g. Clean Water Initiative 2025"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12 rounded-lg border-[#e0d8c9]"
              />
            </div>

            {/* Category */}
            <div>
              <Select
                label="Purpose / Grant Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 rounded-lg border-[#e0d8c9]"
              >
                <option value="">Select a primary focus area</option>
                <option>Software Engineering</option>
                <option>Design</option>
                <option>Entrepreneurship</option>
                <option>STEM Education</option>
              </Select>
            </div>

            {/* Funding Goal */}
            <div className="border-t border-[#e0d8c9]/40 pt-6">
              <Input
                label="Funding Goal (Amount)"
                placeholder="100,000"
                icon={<span className="text-lg">$</span>}
                hint="Set a realistic target based on your project scope."
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="h-12 rounded-lg border-[#e0d8c9]"
              />
            </div>

            {/* Visibility */}
            <div className="border-t border-[#e0d8c9]/40 pt-6">
              <p className="mb-3 text-sm font-semibold text-[#1b1c1c]">Visibility</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  onClick={() => setVisibility("public")}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-5 text-left transition",
                    visibility === "public"
                      ? "border-[#d4af37] bg-[#fffdf8]"
                      : "border-[#e0d8c9] hover:border-[#d4af37]"
                  )}
                >
                  <Globe2 className="h-5 w-5 text-[#735c00]" />
                  <p className="text-base font-semibold text-[#1b1c1c]">Public</p>
                  <p className="text-sm text-[#6d6a66]">Anyone can discover and join.</p>
                </button>
                <button
                  onClick={() => setVisibility("private")}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-lg border p-5 text-left transition",
                    visibility === "private"
                      ? "border-[#d4af37] bg-[#fffdf8]"
                      : "border-[#e0d8c9] hover:border-[#d4af37]"
                  )}
                >
                  <Lock className="h-5 w-5 text-[#735c00]" />
                  <p className="text-base font-semibold text-[#1b1c1c]">Private</p>
                  <p className="text-sm text-[#6d6a66]">Invite only access.</p>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
              <Link
                href="/grants"
                className="text-sm font-semibold text-[#6d6a66] hover:text-[#735c00]"
              >
                Cancel
              </Link>
              <Button
                onClick={handleCreate}
                disabled={!name || isSubmitting}
                className="bg-[#d4af37] font-semibold hover:bg-[#c9a32e]"
              >
                {isSubmitting ? "Creating…" : "Create Group"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}