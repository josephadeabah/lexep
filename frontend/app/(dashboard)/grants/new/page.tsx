"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { X, Globe2, Lock, Copy } from "lucide-react";
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
        goal_amount: Number(goal || 0),
        visibility,
      });
      router.push(`/grants/${group.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-surface-container-low px-gutter py-xl min-h-screen">
      <div className="pb-md mx-auto flex max-w-2xl items-center justify-between">
        <h1 className="text-headline-md text-on-background flex items-center gap-2">
          <span className="text-primary">Lexep Impact</span>
        </h1>
        <Link
          href="/grants"
          className="text-label-md text-on-surface-variant hover:text-primary flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Cancel
        </Link>
      </div>
      <p className="mb-lg text-body-md text-on-surface-variant mx-auto -mt-4 max-w-2xl">
        Establish a dedicated space for targeted community contributions.
      </p>

      <div className="card-level1 p-md mx-auto max-w-2xl">
        <div className="gap-md flex flex-col">
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

          <div className="border-outline-variant/40 pt-md border-t">
            <Input
              label="Funding Goal (Amount)"
              placeholder="100,000"
              icon={<span className="text-body-md">$</span>}
              hint="Set a realistic target based on your project scope."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>

          <div className="border-outline-variant/40 pt-md border-t">
            <p className="text-label-md text-on-surface mb-2">Visibility</p>
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
                <Globe2 className="text-on-surface h-5 w-5" />
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
                <Lock className="text-on-surface h-5 w-5" />
                <p className="text-label-md text-on-background">Private</p>
                <p className="text-label-sm text-on-surface-variant">Invite only access.</p>
              </button>
            </div>
          </div>

          <div className="border-outline-variant/40 pt-md flex items-center justify-between border-t">
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
