"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Briefcase, Building2, History, Link as LinkIcon, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { Textarea } from "@/components/ui/text-area/Textarea";
import { api } from "@/lib/api";
import styles from "../../../onboarding/onboarding.module.css";

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
    <div className={styles.shell}>
      <div className={styles.header}>
        <span className={styles.headerLogo}>Lexep</span>
        <p className={styles.headerSubtitle}>Mentor Application Portal</p>
      </div>

      <div className={styles.content}>
        <div className={styles.card}>
          <div className={styles.progressLabel}>
            <span>APPLICATION PROGRESS</span>
            <span className={styles.progressLabelRight}>Step {step} of 3</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(step / 3) * 100}%` }} />
          </div>

          {step === 1 && (
            <div className={styles.formGrid}>
              <div>
                <p className={styles.stepLabel}>STEP 1 OF 3</p>
                <h1 className={styles.cardTitle}>Personal & Professional Info</h1>
                <p className={styles.cardSubtitle}>
                  Tell us about your background and expertise to help us match you with the right
                  learners.
                </p>
              </div>

              <div className={styles.formGrid}>
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
                <div className={styles.twoCol}>
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

              <div className={styles.footer}>
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
            <div className={styles.formGrid}>
              <div>
                <p className={styles.stepLabel}>STEP 2 OF 3</p>
                <h1 className={styles.cardTitle}>Expertise & Availability</h1>
              </div>

              <div>
                <h2 className={styles.sectionTitle}>Area of Expertise</h2>
                <p className={styles.sectionSubtitle}>
                  Select your primary industry and specific skills you can mentor on.
                </p>
                <div className={styles.formGrid}>
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
                    <p className={styles.optionTitle}>Specific Skills (Select up to 5)</p>
                    <div className={styles.optionsGridThree}>
                      {SKILLS.map((skill) => (
                        <Checkbox
                          key={skill}
                          label={skill}
                          checked={skills.includes(skill)}
                          onChange={() => toggle(skills, setSkills, skill, 5)}
                          className={styles.checkboxCard}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className={styles.sectionTitle}>Weekly Availability</h2>
                <p className={styles.sectionSubtitle}>
                  Estimate the hours you can dedicate to mentoring students each week.
                </p>
                <div className={styles.twoCol}>
                  <div>
                    <p className={styles.optionTitle}>Hours per Week</p>
                    {HOURS.map((h) => (
                      <label
                        key={h}
                        className={cn(styles.radioCard, hours === h && styles.radioCardSelected)}
                      >
                        <input
                          type="radio"
                          name="hours"
                          checked={hours === h}
                          onChange={() => setHours(h)}
                          className="h-4 w-4 accent-[#d4af37]"
                        />
                        {h}
                      </label>
                    ))}
                  </div>
                  <div>
                    <p className={styles.optionTitle}>Preferred Timeframes</p>
                    {TIMEFRAMES.map((t) => (
                      <Checkbox
                        key={t}
                        label={t}
                        checked={timeframes.includes(t)}
                        onChange={() => toggle(timeframes, setTimeframes, t)}
                        className={cn(styles.checkboxCard)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className={styles.footer}>
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
            <div className={styles.formGrid}>
              <div>
                <p className={styles.stepLabel}>STEP 3 OF 3</p>
                <h1 className={styles.cardTitle}>Motivation & Submission</h1>
                <p className={styles.cardSubtitle}>
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
                  className={styles.checkboxCard}
                />
              </div>

              <div className={styles.footer}>
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
