"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Briefcase, Building2, Link as LinkIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { Textarea } from "@/components/ui/text-area/Textarea";
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
    <div className="min-h-screen bg-[#fbf9f8]">
      {/* Header */}
      <div className="border-b border-[#e0d8c9]/40 bg-white px-6 py-4 text-center">
        <span className="font-['Hanken_Grotesk'] text-xl font-bold text-[#735c00]">Lexep</span>
        <p className="text-sm text-[#6d6a66]">Mentor Application Portal</p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-[#e0d8c9] bg-white p-8 shadow-sm">
          {/* Progress */}
          <div className="mb-6 flex items-center justify-between text-xs font-semibold">
            <span className="text-[#6d6a66]">APPLICATION PROGRESS</span>
            <span className="text-[#735c00]">Step {step} of 3</span>
          </div>
          <div className="mb-8 h-1 rounded-full bg-[#e0d8c9]">
            <div
              className="h-1 rounded-full bg-[#d4af37] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#6d6a66] uppercase">
                  STEP 1 OF 3
                </p>
                <h2 className="mt-2 font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                  Personal & Professional Info
                </h2>
                <p className="mt-2 text-[#6d6a66]">
                  Tell us about your background and expertise to help us match you with the right
                  learners.
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  label="Full Name"
                  placeholder="Jane Doe"
                  icon={<Briefcase className="h-4 w-4" />}
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                />
                <div className="grid gap-4 sm:grid-cols-2">
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
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
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

              <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
                <Link href="/dashboard" className="text-sm text-[#6d6a66] hover:text-[#735c00]">
                  Cancel
                </Link>
                <Button onClick={handleStep1Continue} disabled={isSubmitting}>
                  Continue to Step 2 →
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#6d6a66] uppercase">
                  STEP 2 OF 3
                </p>
                <h2 className="mt-2 font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                  Expertise & Availability
                </h2>
              </div>

              <div>
                <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  Area of Expertise
                </h2>
                <p className="mt-1 text-sm text-[#6d6a66]">
                  Select your primary industry and specific skills you can mentor on.
                </p>
                <div className="mt-4 space-y-4">
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
                  <div>
                    <p className="text-sm font-semibold text-[#1b1c1c]">
                      Specific Skills (Select up to 5)
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {SKILLS.map((skill) => (
                        <Checkbox
                          key={skill}
                          label={skill}
                          checked={skills.includes(skill)}
                          onChange={() => toggle(skills, setSkills, skill, 5)}
                          className="rounded-lg border border-[#e0d8c9] p-3"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  Weekly Availability
                </h2>
                <p className="mt-1 text-sm text-[#6d6a66]">
                  Estimate the hours you can dedicate to mentoring students each week.
                </p>
                <div className="mt-4 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-semibold text-[#1b1c1c]">Hours per Week</p>
                    <div className="mt-2 space-y-2">
                      {HOURS.map((h) => (
                        <label
                          key={h}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition",
                            hours === h
                              ? "border-[#d4af37] bg-[#fffdf8]"
                              : "border-[#e0d8c9] hover:border-[#d4af37]"
                          )}
                        >
                          <input
                            type="radio"
                            name="hours"
                            checked={hours === h}
                            onChange={() => setHours(h)}
                            className="h-4 w-4 accent-[#d4af37]"
                          />
                          <span className="text-sm text-[#1b1c1c]">{h}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1b1c1c]">Preferred Timeframes</p>
                    <div className="mt-2 space-y-2">
                      {TIMEFRAMES.map((t) => (
                        <Checkbox
                          key={t}
                          label={t}
                          checked={timeframes.includes(t)}
                          onChange={() => toggle(timeframes, setTimeframes, t)}
                          className="rounded-lg border border-[#e0d8c9] p-3"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
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
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold tracking-wider text-[#6d6a66] uppercase">
                  STEP 3 OF 3
                </p>
                <h2 className="mt-2 font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                  Motivation & Submission
                </h2>
                <p className="mt-2 text-[#6d6a66]">
                  We'd love to know what drives you to share your expertise with the next generation
                  of architects.
                </p>
              </div>

              <div>
                <Textarea
                  label="Why do you want to mentor on Lexep?"
                  placeholder="Share your story, your vision for African youth, or the specific skills you wish you had early in your career…"
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="min-h-[160px]"
                />
              </div>

              <div>
                <Checkbox
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  label={
                    <>
                      I agree to the <span className="text-[#735c00]">Terms & Conditions</span> and{" "}
                      <span className="text-[#735c00]">Mentor Code of Conduct</span>. I confirm that
                      all information provided is accurate.
                    </>
                  }
                  className="rounded-lg border border-[#e0d8c9] p-4"
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
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
