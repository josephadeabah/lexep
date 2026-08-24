"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Radio } from "@/components/ui/Radio";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

const CAREER_INTERESTS = [
  "Software Engineering",
  "UI/UX Design",
  "Data Science",
  "Product Management",
  "Digital Marketing",
  "Architecture",
];

const GOALS = [
  { id: "Finding a Mentor", label: "Finding a Mentor" },
  { id: "Internship Opportunities", label: "Internship Opportunities" },
  { id: "Building Professional Skills", label: "Building Professional Skills" },
  { id: "Networking", label: "Networking" },
];

const TIME_COMMITMENTS = ["1-5 hours", "5-10 hours", "10+ hours"];

export default function LearnerOnboardingPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [step, setStep] = useState(1);
  const [educationLevel, setEducationLevel] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [institution, setInstitution] = useState("");
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [timeCommitment, setTimeCommitment] = useState("5-10 hours");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleInterest(interest: string) {
    setInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

  function toggleGoal(goal: string) {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  async function handleComplete() {
    setIsSubmitting(true);
    try {
      const user = await api.onboardLearner({
        education_level: educationLevel,
        field_of_study: fieldOfStudy,
        institution,
        career_interests: interests,
        goals,
        weekly_time_commitment: timeCommitment,
      });
      setUser(user);
      router.push("/dashboard");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-gutter py-xl">
      <div className="card-level1 w-full max-w-2xl p-md">
        <div className="mb-6 text-center">
          <p className="text-label-sm text-on-surface-variant">STEP {step} OF 2</p>
          <h1 className="mt-2 text-headline-lg text-on-background">
            {step === 1 ? "Tailor Your Learning Journey" : "Your Goals & Preferences"}
          </h1>
          <p className="mx-auto mt-2 max-w-md text-body-md text-on-surface-variant">
            {step === 1
              ? "Tell us a bit about your background so we can customize your Lexep experience."
              : "Help us tailor your experience to match your career aspirations."}
          </p>
        </div>

        <Stepper currentStep={step} totalSteps={2} />

        {step === 1 ? (
          <div className="mt-lg flex flex-col gap-md">
            <div>
              <h2 className="text-headline-md text-on-background">Educational Background</h2>
              <div className="mt-3 flex flex-col gap-md">
                <Select
                  label="Current Level of Education"
                  value={educationLevel}
                  onChange={(e) => setEducationLevel(e.target.value)}
                >
                  <option value="">Select your education level</option>
                  <option value="secondary">Secondary School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="self-taught">Self-taught</option>
                </Select>
                <div className="grid gap-md sm:grid-cols-2">
                  <Input
                    label="Field of Study"
                    placeholder="e.g. Computer Science"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                  />
                  <Input
                    label="Institution"
                    placeholder="e.g. University of Lagos"
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-headline-md text-on-background">Career Interests</h2>
                <span className="text-label-sm text-on-surface-variant">Select multiple</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {CAREER_INTERESTS.map((interest) => (
                  <button
                    key={interest}
                    onClick={() => toggleInterest(interest)}
                    className={cn(
                      "rounded-full border px-4 py-2 text-body-md transition",
                      interests.includes(interest)
                        ? "border-primary-container bg-primary-fixed text-on-primary-fixed-variant"
                        : "border-outline-variant text-on-surface hover:bg-surface-container-low"
                    )}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between border-t border-outline-variant/40 pt-md">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Skip for now
              </Button>
              <Button onClick={() => setStep(2)}>Next Step</Button>
            </div>
          </div>
        ) : (
          <div className="mt-lg flex flex-col gap-lg">
            <div>
              <h2 className="text-headline-md text-on-background">What are you looking for?</h2>
              <p className="text-label-sm text-on-surface-variant">Select all that apply.</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {GOALS.map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => toggleGoal(goal.id)}
                    className={cn(
                      "flex items-center gap-3 rounded-md border px-4 py-4 text-left transition",
                      goals.includes(goal.id)
                        ? "border-primary-container bg-surface-container-low"
                        : "border-outline-variant hover:bg-surface-container-low"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-5 w-5 items-center justify-center rounded-sm border",
                        goals.includes(goal.id)
                          ? "border-primary-container bg-primary-container text-on-primary-container"
                          : "border-outline-variant"
                      )}
                    >
                      {goals.includes(goal.id) && "✓"}
                    </span>
                    <span className="text-body-md text-on-surface">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-headline-md text-on-background">Weekly Time Commitment</h2>
              <p className="text-label-sm text-on-surface-variant">
                How much time can you dedicate to Lexep?
              </p>
              <div className="mt-3 flex flex-col gap-3">
                {TIME_COMMITMENTS.map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-md border px-4 py-3",
                      timeCommitment === option
                        ? "border-primary-container bg-surface-container-low"
                        : "border-outline-variant"
                    )}
                  >
                    <Radio
                      name="time-commitment"
                      checked={timeCommitment === option}
                      onChange={() => setTimeCommitment(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-outline-variant/40 pt-md">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleComplete} disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Complete Profile"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
