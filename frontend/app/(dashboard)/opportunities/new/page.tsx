"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, MapPin, X, Edit3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { Textarea } from "@/components/ui/text-area/Textarea";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { api } from "@/lib/api";

const STEP_LABELS = ["Basics", "Details", "Review"];
const STEP_TITLES = [
  {
    title: "Post an Internship",
    subtitle: "STEP 1 OF 3 · ROLE BASICS",
  },
  {
    title: "Role Details",
    subtitle: "Provide specific information about the internship role and compensation.",
  },
  {
    title: "Post an Internship",
    subtitle: "Step 3 of 3: Requirements & Review",
  },
];

function StepHeader({ step }: { step: number }) {
  return (
    <div className="mb-10 flex items-center">
      {STEP_LABELS.map((label, i) => {
        const index = i + 1;
        const done = index < step;
        const active = index === step;
        return (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                  done || active
                    ? "bg-[#d4af37] text-[#1b1c1c]"
                    : "bg-[#f0f0f0] text-[#6d6a66]"
                )}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : index}
              </span>
              <span className="text-xs text-[#6d6a66]">{label}</span>
            </div>
            {index !== STEP_LABELS.length && (
              <div
                className={cn(
                  "mx-2 h-0.5 flex-1 rounded-full",
                  done ? "bg-[#d4af37]" : "bg-[#e0d8c9]"
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
    <div className="mx-auto max-w-3xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
          {STEP_TITLES[step - 1].title}
        </h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-[#735c00]">
          {STEP_TITLES[step - 1].subtitle}
        </p>
      </div>

      {/* Step Progress */}
      <StepHeader step={step} />

      {/* Main Card */}
      <div className="rounded-lg border border-[#e0d8c9] bg-white p-8 shadow-sm">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Internship Title
              </label>
              <Input
                placeholder="e.g. Software Engineering Intern"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-md border-[#e0d8c9] bg-white text-base"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Category
              </label>
              <Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-12 rounded-md border-[#e0d8c9] bg-white text-base"
              >
                <option value="">Select an area of focus</option>
                <option>Software Engineering</option>
                <option>Product Design</option>
                <option>Data Science</option>
                <option>Marketing</option>
              </Select>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#1b1c1c]">Work Mode</p>
              <div className="grid grid-cols-3 gap-3">
                {(["remote", "hybrid", "onsite"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setWorkMode(mode)}
                    className={cn(
                      "flex h-12 items-center justify-center rounded-md border text-sm font-semibold transition",
                      workMode === mode
                        ? "border-[#d4af37] bg-[#fffdf8] text-[#1b1c1c]"
                        : "border-[#e0d8c9] text-[#6d6a66] hover:border-[#d4af37]/50"
                    )}
                  >
                    {mode.charAt(0).toUpperCase() + mode.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6d6a66]" />
                <Input
                  placeholder="City, Country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="h-12 rounded-md border-[#e0d8c9] bg-white pl-10 text-base"
                />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk']">
                Role Details
              </p>
              <p className="mt-1 text-sm text-[#6d6a66]">
                Provide specific information about the internship role and compensation.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Duration
              </label>
              <Select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="h-12 rounded-md border-[#e0d8c9] bg-white text-base"
              >
                <option value="">Select duration</option>
                <option>3 Months</option>
                <option>4 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </Select>
            </div>

            <div className="rounded-md bg-[#f5f3f3] p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base font-semibold text-[#1b1c1c]">Stipend Provided</p>
                  <p className="text-sm text-[#6d6a66]">
                    Is this a paid internship?
                  </p>
                </div>
                <button
                  onClick={() => setStipendProvided((v) => !v)}
                  className={cn(
                    "flex h-7 w-12 items-center rounded-full p-1 transition",
                    stipendProvided
                      ? "bg-[#d4af37] justify-end"
                      : "bg-[#e0d8c9] justify-start"
                  )}
                >
                  <span className="h-5 w-5 rounded-full bg-white shadow" />
                </button>
              </div>
              {stipendProvided && (
                <div className="mt-6">
                  <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                    Monthly Stipend Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg text-[#6d6a66]">
                      $
                    </span>
                    <Input
                      placeholder="e.g. 500"
                      value={stipendAmount}
                      onChange={(e) => setStipendAmount(e.target.value)}
                      className="h-12 rounded-md border-[#e0d8c9] bg-white pl-8 text-base"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                About the Role
              </label>
              <p className="mb-2 text-sm text-[#6d6a66]">
                Describe responsibilities, learning outcomes, and expectations.
              </p>
              <Textarea
                placeholder="Write a detailed description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] rounded-md border-[#e0d8c9] bg-white text-base"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk']">
                Final Requirements
              </p>
            </div>

            <div>
              <p className="text-base font-semibold text-[#1b1c1c]">Required Skills (Tags)</p>
              <p className="mt-1 text-sm text-[#6d6a66]">Press enter to add skills.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-md border border-[#e0d8c9] p-3">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full border border-[#e0d8c9] bg-white px-3 py-1 text-sm text-[#1b1c1c]"
                  >
                    {skill}
                    <button
                      onClick={() => setSkills((prev) => prev.filter((s) => s !== skill))}
                      className="text-[#6d6a66] hover:text-[#1b1c1c]"
                    >
                      <X className="h-3 w-3" />
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
                  placeholder="Add a skill..."
                  className="min-w-[120px] flex-1 bg-transparent text-base outline-none"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">
                Application Deadline
              </label>
              <Input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="h-12 rounded-md border-[#e0d8c9] bg-white text-base"
              />
            </div>

            <div className="rounded-md bg-[#f5f3f3] p-6">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk']">
                  Review Details
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="flex items-center gap-1 text-sm font-semibold text-[#735c00] hover:underline"
                >
                  <Edit3 className="h-3 w-3" /> Edit
                </button>
              </div>
              <div className="grid gap-6 text-base text-[#1b1c1c] sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6d6a66]">
                    Role Title
                  </p>
                  <p className="mt-1">{title || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6d6a66]">
                    Location
                  </p>
                  <p className="mt-1">
                    {location || "—"} ({workMode})
                  </p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6d6a66]">
                    Duration
                  </p>
                  <p className="mt-1">{duration || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6d6a66]">
                    Stipend
                  </p>
                  <p className="mt-1">
                    {stipendProvided ? `Paid ($${stipendAmount || "0"}/mo)` : "Unpaid"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#6d6a66]">
                    Description Summary
                  </p>
                  <p className="mt-1">{description || "—"}</p>
                </div>
              </div>
            </div>

            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              label="I agree to the Employer Terms of Service and confirm that all provided information is accurate and complies with fair hiring practices."
              className="text-sm text-[#6d6a66]"
            />
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
          {step > 1 ? (
            <Button
              variant="outline"
              onClick={() => setStep((s) => s - 1)}
              className="h-12 rounded-md border-[#e0d8c9] px-6 text-base"
            >
              Back
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/opportunities")}
              className="h-12 rounded-md border-[#e0d8c9] px-6 text-base"
            >
              Cancel
            </Button>
          )}
          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 1 && !title}
              className="h-12 rounded-md bg-[#d4af37] px-8 text-base font-semibold hover:bg-[#c9a32e]"
            >
              Continue to Step {step + 1} →
            </Button>
          ) : (
            <Button
              onClick={handlePublish}
              disabled={!agreed || isSubmitting}
              className="h-12 rounded-md bg-[#d4af37] px-8 text-base font-semibold hover:bg-[#c9a32e]"
            >
              {isSubmitting ? "Publishing..." : "Publish Internship"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}