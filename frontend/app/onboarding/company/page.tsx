"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import styles from "../onboarding.module.css";

const GOALS = [
  {
    id: "Finding Interns",
    title: "Finding Interns",
    description: "Source top entry-level talent.",
  },
  {
    id: "Sponsoring Youth Projects",
    title: "Sponsoring Youth Projects",
    description: "Support guided learning.",
  },
  {
    id: "Brand Awareness in Tech",
    title: "Brand Awareness in Tech",
    description: "Build presence among students.",
  },
];

export default function CompanyOnboardingPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [industry, setIndustry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [emailDigests, setEmailDigests] = useState(true);
  const [directInquiries, setDirectInquiries] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleGoal(id: string) {
    setGoals((prev) => (prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id]));
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const user = await api.onboardCompany({
        industry,
        company_size: companySize,
        website_url: websiteUrl,
        hiring_goals: goals,
        receive_email_digests: emailDigests,
        allow_direct_inquiries: directInquiries,
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
            <p className={styles.stepLabel}>
              <Building2 className="mr-1 inline h-4 w-4" /> Step 1 of 1
            </p>
            <h1 className={styles.cardTitle}>Set Up Your Company Profile</h1>
            <p className={styles.cardSubtitle}>
              Complete your profile to start connecting with top emerging talent.
            </p>
          </div>

          <div className={styles.formGrid}>
            <div>
              <h2 className={styles.sectionTitle}>Company Details</h2>
              <div className={styles.twoCol}>
                <Input
                  label="Industry"
                  placeholder="e.g. Technology, Finance"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
                <Select
                  label="Company Size"
                  value={companySize}
                  onChange={(e) => setCompanySize(e.target.value)}
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10</option>
                  <option value="11-50">11-50</option>
                  <option value="51-200">51-200</option>
                  <option value="200+">200+</option>
                </Select>
                <div className={styles.fullWidth}>
                  <Input
                    label="Website URL"
                    placeholder="https://www.example.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Hiring Goals</h2>
              <p className={styles.sectionSubtitle}>
                What are you hoping to achieve on this platform? (Select all that apply)
              </p>
              <div className={styles.optionsGrid}>
                {GOALS.map((goal) => (
                  <label
                    key={goal.id}
                    className={cn(
                      styles.checkboxCard,
                      goals.includes(goal.id) && styles.checkboxCardSelected
                    )}
                  >
                    <Checkbox
                      checked={goals.includes(goal.id)}
                      onChange={() => toggleGoal(goal.id)}
                    />
                    <div>
                      <p className={styles.optionTitle}>{goal.title}</p>
                      <p className={styles.optionDescription}>{goal.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Preferred Outreach</h2>
              <div className={styles.formGrid}>
                <Checkbox
                  label="Receive regular email digests of top candidates."
                  checked={emailDigests}
                  onChange={(e) => setEmailDigests(e.target.checked)}
                  className={cn(styles.checkboxCard)}
                />
                <Checkbox
                  label="Allow students to send direct inquiries."
                  checked={directInquiries}
                  onChange={(e) => setDirectInquiries(e.target.checked)}
                  className={cn(styles.checkboxCard)}
                />
              </div>
            </div>

            <div className={styles.footer} style={{ justifyContent: "flex-end" }}>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Finish Setup"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
