"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/select/Select";
import { Input } from "@/components/ui/input/Input";
import { Radio } from "@/components/ui/radio/Radio";
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
    <div className="min-h-screen bg-[#fbf9f8]">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-[#e0d8c9] bg-white p-8 shadow-sm sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <p className="text-xs font-bold tracking-wider text-[#6d6a66] uppercase">
              STEP {step} OF 2
            </p>
            <h2 className="mt-2 font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c] sm:text-4xl">
              {step === 1 ? "Tailor Your Learning Journey" : "Your Goals & Preferences"}
            </h2>
            <p className="mx-auto mt-3 max-w-md text-[#6d6a66]">
              {step === 1
                ? "Tell us a bit about your background so we can customize your Lexep experience."
                : "Help us tailor your experience to match your career aspirations."}
            </p>
          </div>

          {/* Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between text-xs font-semibold">
              <span className="text-[#6d6a66]">{step === 1 ? "Step 1" : "Step 2"}</span>
              <span className="text-[#735c00]">{step === 1 ? "Almost Done" : "Almost Done"}</span>
            </div>
            <div className="mt-2 h-1 rounded-full bg-[#e0d8c9]">
              <div
                className="h-1 rounded-full bg-[#d4af37] transition-all duration-300"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>
          </div>

          {step === 1 ? (
            <div className="space-y-8">
              {/* Educational Background */}
              <div>
                <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  Educational Background
                </h2>
                <div className="mt-4 space-y-4">
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
                  <div className="grid gap-4 sm:grid-cols-2">
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

              {/* Career Interests */}
              <div>
                <div className="flex items-center justify-between">
                  <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                    Career Interests
                  </h2>
                  <span className="text-sm text-[#6d6a66]">Select multiple</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {CAREER_INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(
                        "rounded-full border px-4 py-2 text-sm transition",
                        interests.includes(interest)
                          ? "border-[#d4af37] bg-[#fffdf8] text-[#1b1c1c]"
                          : "border-[#e0d8c9] text-[#1b1c1c] hover:border-[#d4af37]"
                      )}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Skip for now
                </Button>
                <Button onClick={() => setStep(2)}>Next Step</Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Goals */}
              <div>
                <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  What are you looking for?
                </h2>
                <p className="mt-1 text-sm text-[#6d6a66]">Select all that apply.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {GOALS.map((goal) => (
                    <label
                      key={goal.id}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition",
                        goals.includes(goal.id)
                          ? "border-[#d4af37] bg-[#fffdf8]"
                          : "border-[#e0d8c9] hover:border-[#d4af37]"
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={goals.includes(goal.id)}
                        onChange={() => toggleGoal(goal.id)}
                        className="h-4 w-4 accent-[#d4af37]"
                      />
                      <span className="text-sm font-medium text-[#1b1c1c]">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Time Commitment */}
              <div>
                <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  Weekly Time Commitment
                </h2>
                <p className="mt-1 text-sm text-[#6d6a66]">
                  How much time can you dedicate to Lexep?
                </p>
                <div className="mt-4 space-y-3">
                  {TIME_COMMITMENTS.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition",
                        timeCommitment === option
                          ? "border-[#d4af37] bg-[#fffdf8]"
                          : "border-[#e0d8c9] hover:border-[#d4af37]"
                      )}
                    >
                      <Radio
                        name="time-commitment"
                        checked={timeCommitment === option}
                        onChange={() => setTimeCommitment(option)}
                      />
                      <span className="text-sm font-medium text-[#1b1c1c]">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
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
    </div>
  );
}
