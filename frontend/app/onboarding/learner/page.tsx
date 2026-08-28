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
import styles from "../onboarding.module.css";

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
    <div className={styles.shell}>
      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <p className={styles.stepLabel}>STEP {step} OF 2</p>
            <h1 className={styles.cardTitle}>
              {step === 1 ? "Tailor Your Learning Journey" : "Your Goals & Preferences"}
            </h1>
            <p className={styles.cardSubtitle}>
              {step === 1
                ? "Tell us a bit about your background so we can customize your Lexep experience."
                : "Help us tailor your experience to match your career aspirations."}
            </p>
          </div>

          {/* Stepper */}
          <div className={styles.stepper}>
            <div className={styles.stepperTrack}>
              <div className={styles.stepperFill} style={{ width: step === 1 ? "50%" : "100%" }} />
            </div>
            <div className={styles.progressLabel}>
              <span>{step === 1 ? "Step 1" : "Step 2"}</span>
              <span className={styles.progressLabelRight}>
                {step === 1 ? "Almost Done" : "Almost Done"}
              </span>
            </div>
          </div>

          {step === 1 ? (
            <div className={styles.formGrid}>
              <div>
                <h2 className={styles.sectionTitle}>Educational Background</h2>
                <div className={styles.formGrid}>
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
                  <div className={styles.twoCol}>
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
                  <h2 className={styles.sectionTitle}>Career Interests</h2>
                  <span className="text-sm text-[#6d6a66]">Select multiple</span>
                </div>
                <div className={styles.tagList}>
                  {CAREER_INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => toggleInterest(interest)}
                      className={cn(styles.tag, interests.includes(interest) && styles.tagSelected)}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.footer}>
                <Button variant="ghost" onClick={() => setStep(2)}>
                  Skip for now
                </Button>
                <Button onClick={() => setStep(2)}>Next Step</Button>
              </div>
            </div>
          ) : (
            <div className={styles.formGrid}>
              <div>
                <h2 className={styles.sectionTitle}>What are you looking for?</h2>
                <p className={styles.sectionSubtitle}>Select all that apply.</p>
                <div className={styles.optionsGrid}>
                  {GOALS.map((goal) => (
                    <label
                      key={goal.id}
                      className={cn(
                        styles.checkboxCard,
                        goals.includes(goal.id) && styles.checkboxCardSelected
                      )}
                    >
                      <input
                        type="checkbox"
                        checked={goals.includes(goal.id)}
                        onChange={() => toggleGoal(goal.id)}
                        className="mt-0.5 h-4 w-4 accent-[#d4af37]"
                      />
                      <span className="text-sm font-medium text-[#1b1c1c]">{goal.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h2 className={styles.sectionTitle}>Weekly Time Commitment</h2>
                <p className={styles.sectionSubtitle}>How much time can you dedicate to Lexep?</p>
                <div className={styles.formGrid}>
                  {TIME_COMMITMENTS.map((option) => (
                    <label
                      key={option}
                      className={cn(
                        styles.radioCard,
                        timeCommitment === option && styles.radioCardSelected
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

              <div className={styles.footer}>
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
