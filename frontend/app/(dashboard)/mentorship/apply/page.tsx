"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User as UserIcon, Briefcase, Building2, History, Link as LinkIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";
import { api } from "@/lib/api";

const INDUSTRIES = ["Technology", "Design", "Finance", "Healthcare", "Education", "Marketing"];
const SKILLS = [
  "UX Design",
  "Fullstack Dev",
  "Product Mgmt",
  "Data Science",
  "Digital Marketing",
  "Leadership",
];
const HOURS = ["1 - 2 hours", "3 - 5 hours", "5+ hours"];
const TIMEFRAMES = ["Weekdays (Mornings)", "Weekdays (Evenings)", "Weekends"];

export default function MentorApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [years, setYears] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Step 2
  const [industry, setIndustry] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [hours, setHours] = useState("");
  const [timeframes, setTimeframes] = useState<string[]>([]);

  // Step 3
  const [motivation, setMotivation] = useState("");
  const [agreed, setAgreed] = useState(false);

  function toggle(list: string[], setList: (v: string[]) => void, value: string, max?: number) {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      if (max && list.length >= max) return;
      setList([...list, value]);
    }
  }

  async function handleStep1Continue() {
    setIsSubmitting(true);
    try {
      await api.mentorApplicationStep1({
        title: role,
        company,
        years_experience: years,
        linkedin_url: linkedin,
      });
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStep2Continue() {
    setIsSubmitting(true);
    try {
      await api.mentorApplicationStep2({
        primary_industry: industry,
        skills,
        hours_per_week: hours,
        preferred_timeframes: timeframes,
      });
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await api.mentorApplicationStep3({ motivation, agreed_to_terms: agreed });
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-surface-container-low px-gutter py-xl min-h-screen">
      <div className="pb-md mx-auto flex max-w-2xl items-center justify-between">
        <span className="text-headline-md text-primary">Lexep</span>
        <Link
          href="/dashboard"
          className="text-label-md text-on-surface-variant hover:text-primary flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Cancel
        </Link>
      </div>
      <p className="mb-lg text-body-md text-on-surface-variant mx-auto -mt-3 max-w-2xl text-center">
        Mentor Application Portal
      </p>

      <div className="bg-surface-container-lowest shadow-level1 mx-auto max-w-2xl overflow-hidden rounded-lg">
        <div className="bg-surface-container-high h-1 w-full">
          <div
            className="bg-primary-container h-1 transition-all"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        <div className="p-md">
          {step === 1 && (
            <div>
              <p className="text-label-sm text-on-surface-variant">STEP 1 OF 3</p>
              <h1 className="text-headline-lg text-on-background mt-1">
                Personal &amp; Professional Info
              </h1>
              <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
                Tell us about your background and expertise to help us match you with the right
                learners.
              </p>

              <div className="mt-lg gap-md flex flex-col">
                <Input
                  label="Current Role"
                  placeholder="Senior Architect"
                  icon={<Briefcase className="h-4 w-4" />}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <Input
                  label="Company / Organization"
                  placeholder="Studio Design Group"
                  icon={<Building2 className="h-4 w-4" />}
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
                <div className="gap-md grid sm:grid-cols-2">
                  <Select
                    label="Years of Exp."
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                  >
                    <option value="">Select</option>
                    <option>0-2</option>
                    <option>3-5</option>
                    <option>5-10</option>
                    <option>10+</option>
                  </Select>
                  <Input
                    label="LinkedIn Profile URL"
                    placeholder="https://linkedin.com/in/username"
                    icon={<LinkIcon className="h-4 w-4" />}
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
              </div>

              <div className="mt-lg border-outline-variant/40 pt-md flex items-center justify-between border-t">
                <Link
                  href="/dashboard"
                  className="text-label-md text-on-surface-variant hover:text-primary"
                >
                  Cancel
                </Link>
                <Button onClick={handleStep1Continue} disabled={isSubmitting}>
                  Continue to Step 2 →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <p className="text-label-sm text-on-surface-variant">STEP 2 OF 3</p>
              <h1 className="text-headline-lg text-on-background mt-1">
                Expertise &amp; Availability
              </h1>

              <div className="mt-lg">
                <h2 className="text-headline-md text-on-background">Area of Expertise</h2>
                <p className="text-label-sm text-on-surface-variant">
                  Select your primary industry and specific skills you can mentor on.
                </p>
                <div className="mt-3">
                  <Select
                    label="Primary Industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="">Select Industry</option>
                    {INDUSTRIES.map((i) => (
                      <option key={i}>{i}</option>
                    ))}
                  </Select>
                </div>
                <div className="mt-3">
                  <p className="text-label-md text-on-surface mb-2">
                    Specific Skills (Select up to 5)
                  </p>
                  <div className="bg-surface-container-low grid grid-cols-2 gap-2 rounded-md p-3 sm:grid-cols-3">
                    {SKILLS.map((skill) => (
                      <Checkbox
                        key={skill}
                        label={skill}
                        checked={skills.includes(skill)}
                        onChange={() => toggle(skills, setSkills, skill, 5)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-lg border-outline-variant/40 pt-md border-t">
                <h2 className="text-headline-md text-on-background">Weekly Availability</h2>
                <p className="text-label-sm text-on-surface-variant">
                  Estimate the hours you can dedicate to mentoring students each week.
                </p>
                <div className="gap-md mt-3 grid sm:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <p className="text-label-md text-on-surface">Hours per Week</p>
                    {HOURS.map((h) => (
                      <label
                        key={h}
                        className={cn(
                          "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3",
                          hours === h
                            ? "border-primary-container bg-surface-container-low"
                            : "border-outline-variant"
                        )}
                      >
                        <input
                          type="radio"
                          name="hours"
                          checked={hours === h}
                          onChange={() => setHours(h)}
                          className="text-primary h-4 w-4 accent-current"
                        />
                        {h}
                      </label>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-label-md text-on-surface">Preferred Timeframes</p>
                    {TIMEFRAMES.map((t) => (
                      <Checkbox
                        key={t}
                        label={t}
                        checked={timeframes.includes(t)}
                        onChange={() => toggle(timeframes, setTimeframes, t)}
                        className="border-outline-variant rounded-md border px-4 py-3"
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-lg border-outline-variant/40 pt-md flex items-center justify-between border-t">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  ← Back
                </Button>
                <Button onClick={handleStep2Continue} disabled={isSubmitting}>
                  Continue to Profile →
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <p className="text-label-sm text-on-surface-variant">STEP 3 OF 3</p>
              <h1 className="text-headline-lg text-on-background mt-1">
                Motivation &amp; Submission
              </h1>
              <p className="text-body-md text-on-surface-variant mt-2 max-w-md">
                We&apos;d love to know what drives you to share your expertise with the next
                generation.
              </p>

              <div className="mt-lg">
                <Textarea
                  label="Why do you want to mentor on Lexep?"
                  placeholder="Share your story, your vision for African youth, or the specific skills you wish you had early in your career…"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="min-h-[160px]"
                />
              </div>

              <div className="mt-md">
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  label={
                    <>
                      I agree to the <span className="text-primary">Terms &amp; Conditions</span>{" "}
                      and <span className="text-primary">Mentor Code of Conduct</span>. I confirm
                      that all information provided is accurate.
                    </>
                  }
                />
              </div>

              <div className="mt-lg border-outline-variant/40 pt-md flex items-center justify-between border-t">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  ← Back
                </Button>
                <Button onClick={handleSubmit} disabled={!agreed || isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit Application ▷"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
