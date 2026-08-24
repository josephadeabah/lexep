"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { api } from "@/lib/api";

const STEP_LABELS = ["Basics", "Details", "Review"];

function StepHeader({ step }: { step: number }) {
  return (
    <div className="mb-lg flex items-center">
      {STEP_LABELS.map((label, i) => {
        const index = i + 1;
        const done = index < step;
        const active = index === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-label-md",
                  done || active
                    ? "bg-primary-container text-on-primary-container"
                    : "bg-surface-container-high text-on-surface-variant"
                )}
              >
                {done ? <Check className="h-4 w-4" /> : index}
              </span>
              <span className="text-label-sm text-on-surface-variant">{label}</span>
            </div>
            {index !== STEP_LABELS.length && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1",
                  done ? "bg-primary-container" : "bg-surface-container-high"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NewOpportunityPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [workMode, setWorkMode] = useState<"remote" | "hybrid" | "onsite">("remote");
  const [location, setLocation] = useState("");

  const [duration, setDuration] = useState("");
  const [stipendProvided, setStipendProvided] = useState(true);
  const [stipendAmount, setStipendAmount] = useState("");
  const [description, setDescription] = useState("");

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [deadline, setDeadline] = useState("");
  const [agreed, setAgreed] = useState(false);

  function addSkill() {
    const value = skillInput.trim();
    if (value && !skills.includes(value)) setSkills((prev) => [...prev, value]);
    setSkillInput("");
  }

  async function handlePublish() {
    setIsSubmitting(true);
    try {
      const opportunity = await api.createOpportunity({
        title,
        category,
        work_mode: workMode,
        location,
        duration,
        stipend_provided: stipendProvided,
        stipend_amount: stipendAmount ? Number(stipendAmount) : null,
        description,
        required_skills: skills,
        application_deadline: deadline || null,
        status: "published",
      });
      router.push(`/opportunities/${opportunity.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-lg text-center">
        <h1 className="text-headline-lg text-on-background">Post an Internship</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Step {step} of 3:{" "}
          {step === 1 ? "Role Basics" : step === 2 ? "Role Details" : "Requirements & Review"}
        </p>
      </div>

      <StepHeader step={step} />

      <div className="card-level1 p-md">
        {step === 1 && (
          <div className="flex flex-col gap-md">
            <Input
              label="Internship Title"
              placeholder="e.g. Software Engineering Intern"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select an area of focus</option>
              <option>Software Engineering</option>
              <option>Product Design</option>
              <option>Data Science</option>
              <option>Marketing</option>
            </Select>
            <div>
              <p className="mb-1.5 text-label-md text-on-surface">Work Mode</p>
              <div className="grid grid-cols-3 gap-3">
                {(["remote", "hybrid", "onsite"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setWorkMode(mode)}
                    className={cn(
                      "h-11 rounded-md border text-label-md capitalize transition",
                      workMode === mode
                        ? "border-primary-container bg-primary-fixed text-on-primary-fixed-variant"
                        : "border-outline-variant text-on-surface"
                    )}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
            <Input
              label="Location"
              placeholder="City, Country"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-md">
            <Select label="Duration" value={duration} onChange={(e) => setDuration(e.target.value)}>
              <option value="">Select duration</option>
              <option>3 Months</option>
              <option>4 Months</option>
              <option>6 Months</option>
              <option>12 Months</option>
            </Select>

            <div className="rounded-md bg-surface-container-low p-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-label-md text-on-background">Stipend Provided</p>
                  <p className="text-label-sm text-on-surface-variant">
                    Is this a paid internship?
                  </p>
                </div>
                <button
                  onClick={() => setStipendProvided((v) => !v)}
                  className={cn(
                    "flex h-6 w-11 items-center rounded-full px-0.5 transition",
                    stipendProvided
                      ? "justify-end bg-primary-container"
                      : "justify-start bg-outline-variant"
                  )}
                >
                  <span className="h-5 w-5 rounded-full bg-white shadow" />
                </button>
              </div>
              {stipendProvided && (
                <div className="mt-4">
                  <Input
                    label="Monthly Stipend Amount"
                    placeholder="e.g. 500"
                    icon={<span className="text-body-md">$</span>}
                    value={stipendAmount}
                    onChange={(e) => setStipendAmount(e.target.value)}
                  />
                </div>
              )}
            </div>

            <Textarea
              label="About the Role"
              placeholder="Describe responsibilities, learning outcomes, and expectations."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-lg">
            <div>
              <h2 className="text-headline-md text-on-background">Final Requirements</h2>
              <div className="mt-3">
                <p className="text-label-md text-on-surface">Required Skills (Tags)</p>
                <p className="text-label-sm text-on-surface-variant">Press enter to add skills.</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md border border-outline-variant p-3">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-label-sm"
                    >
                      {skill}
                      <button onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}>
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSkill();
                      }
                    }}
                    placeholder="Add a skill…"
                    className="min-w-[120px] flex-1 bg-transparent text-body-md outline-none"
                  />
                </div>
              </div>
              <div className="mt-md">
                <Input
                  label="Application Deadline"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md bg-surface-container-low p-md">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-headline-md text-on-background">Review Details</h3>
                <button
                  onClick={() => setStep(1)}
                  className="text-label-sm text-primary hover:underline"
                >
                  Edit
                </button>
              </div>
              <div className="grid gap-4 text-body-md text-on-surface sm:grid-cols-2">
                <div>
                  <p className="text-label-sm text-on-surface-variant">Role Title</p>
                  <p>{title || "—"}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Location</p>
                  <p>
                    {location || "—"} ({workMode})
                  </p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Duration</p>
                  <p>{duration || "—"}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Stipend</p>
                  <p>{stipendProvided ? `Paid ($${stipendAmount || "0"}/mo)` : "Unpaid"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-label-sm text-on-surface-variant">Description Summary</p>
                  <p>{description || "—"}</p>
                </div>
              </div>
            </div>

            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              label="I agree to the Employer Terms of Service and confirm that all provided information is accurate and complies with fair hiring practices."
            />
          </div>
        )}

        <div className="mt-lg flex items-center justify-between border-t border-outline-variant/40 pt-md">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)} disabled={step === 1 && !title}>
              Continue to Step {step + 1}
            </Button>
          ) : (
            <Button onClick={handlePublish} disabled={!agreed || isSubmitting}>
              {isSubmitting ? "Publishing…" : "Publish Internship"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
