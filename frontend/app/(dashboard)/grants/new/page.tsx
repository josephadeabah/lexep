"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Globe2, Lock, Copy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
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
        goal_amount: Number(goal || 0),
        visibility,
      });
      router.push(`/grants/${group.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface-container-low px-gutter py-xl">
      <div className="mx-auto flex max-w-2xl items-center justify-between pb-md">
        <h1 className="flex items-center gap-2 text-headline-md text-on-background">
          <span className="text-primary">Lexep Impact</span>
        </h1>
        <Link
          href="/grants"
          className="flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary"
        >
          <X className="h-4 w-4" /> Cancel
        </Link>
      </div>
      <p className="mx-auto -mt-4 mb-lg max-w-2xl text-body-md text-on-surface-variant">
        Establish a dedicated space for targeted community contributions.
      </p>

      <div className="card-level1 mx-auto max-w-2xl p-md">
        <div className="flex flex-col gap-md">
          <Input
            label="Group Name"
            placeholder="e.g. Clean Water Initiative 2025"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Select
            label="Purpose / Grant Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a primary focus area</option>
            <option>Software Engineering</option>
            <option>Design</option>
            <option>Entrepreneurship</option>
            <option>STEM Education</option>
          </Select>

          <div className="border-t border-outline-variant/40 pt-md">
            <Input
              label="Funding Goal (Amount)"
              placeholder="100,000"
              icon={<span className="text-body-md">$</span>}
              hint="Set a realistic target based on your project scope."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="border-t border-outline-variant/40 pt-md">
            <p className="mb-2 text-label-md text-on-surface">Visibility</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setVisibility("public")}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-md border p-4 text-left transition",
                  visibility === "public"
                    ? "border-primary-container bg-surface-container-low"
                    : "border-outline-variant"
                )}
              >
                <Globe2 className="h-5 w-5 text-on-surface" />
                <p className="text-label-md text-on-background">Public</p>
                <p className="text-label-sm text-on-surface-variant">
                  Anyone can discover and join.
                </p>
              </button>
              <button
                onClick={() => setVisibility("private")}
                className={cn(
                  "flex flex-col items-start gap-2 rounded-md border p-4 text-left transition",
                  visibility === "private"
                    ? "border-primary-container bg-surface-container-low"
                    : "border-outline-variant"
                )}
              >
                <Lock className="h-5 w-5 text-on-surface" />
                <p className="text-label-md text-on-background">Private</p>
                <p className="text-label-sm text-on-surface-variant">Invite only access.</p>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-outline-variant/40 pt-md">
            <Link
              href="/grants"
              className="text-label-md text-on-surface-variant hover:text-primary"
            >
              Cancel
            </Link>
            <Button onClick={handleCreate} disabled={!name || isSubmitting}>
              {isSubmitting ? "Creating…" : "Create Group →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
