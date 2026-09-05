"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

const GOALS = [
  { id: "Finding Interns", title: "Finding Interns", description: "Source top entry-level talent." },
  { id: "Sponsoring Youth Projects", title: "Sponsoring Youth Projects", description: "Support guided learning." },
  { id: "Brand Awareness in Tech", title: "Brand Awareness in Tech", description: "Build presence among students." },
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
    <div className="min-h-screen bg-surface px-gutter py-xl">
      <div className="mx-auto max-w-2xl card-level1 overflow-hidden p-0">
        <div className="bg-surface-container-low px-md py-md">
          <p className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <Building2 className="h-4 w-4" /> Step 1 of 1
          </p>
          <h1 className="mt-2 text-headline-lg text-on-background">Set Up Your Company Profile</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Complete your profile to start connecting with top emerging talent.
          </p>
        </div>

        <div className="flex flex-col gap-lg p-md">
          <div>
            <h2 className="text-headline-md text-on-background">Company Details</h2>
            <div className="mt-3 grid gap-md sm:grid-cols-2">
              <Input
                label="Industry"
                placeholder="e.g. Technology, Finance"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
              />
              <Select label="Company Size" value={companySize} onChange={(e) => setCompanySize(e.target.value)}>
                <option value="">Select size</option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="200+">200+</option>
              </Select>
              <div className="sm:col-span-2">
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
            <h2 className="text-headline-md text-on-background">Hiring Goals</h2>
            <p className="text-label-sm text-on-surface-variant">
              What are you hoping to achieve on this platform? (Select all that apply)
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {GOALS.map((goal) => (
                <label
                  key={goal.id}
                  className={cn(
                    "flex cursor-pointer flex-col gap-2 rounded-md border p-4",
                    goals.includes(goal.id) ? "border-primary-container bg-surface-container-low" : "border-outline-variant"
                  )}
                >
                  <Checkbox checked={goals.includes(goal.id)} onChange={() => toggleGoal(goal.id)} label={goal.title} />
                  <span className="pl-8 text-label-sm text-on-surface-variant">{goal.description}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-headline-md text-on-background">Preferred Outreach</h2>
            <div className="mt-3 flex flex-col gap-3">
              <Checkbox
                label="Receive regular email digests of top candidates."
                checked={emailDigests}
                onChange={(e) => setEmailDigests(e.target.checked)}
              />
              <Checkbox
                label="Allow students to send direct inquiries."
                checked={directInquiries}
                onChange={(e) => setDirectInquiries(e.target.checked)}
              />
            </div>
          </div>

          <div className="flex justify-end border-t border-outline-variant/40 pt-md">
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Finish Setup"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
