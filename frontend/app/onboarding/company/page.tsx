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
    <div className="min-h-screen bg-[#fbf9f8]">
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-2xl border border-[#e0d8c9] bg-white shadow-sm">
          {/* Header */}
          <div className="border-b border-[#e0d8c9]/40 bg-[#f5f3f3] px-8 py-6">
            <p className="flex items-center gap-2 text-xs font-bold tracking-wider text-[#6d6a66] uppercase">
              <Building2 className="h-4 w-4" /> Step 1 of 1
            </p>
            <h2 className="mt-2 font-['Hanken_Grotesk'] text-2xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
              Set Up Your Company Profile
            </h2>
            <p className="mt-1 text-sm text-[#6d6a66]">
              Complete your profile to start connecting with top emerging talent.
            </p>
          </div>

          <div className="space-y-8 p-8">
            {/* Company Details */}
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                Company Details
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
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

            {/* Hiring Goals */}
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                Hiring Goals
              </h2>
              <p className="mt-1 text-sm text-[#6d6a66]">
                What are you hoping to achieve on this platform? (Select all that apply)
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {GOALS.map((goal) => (
                  <label
                    key={goal.id}
                    className={cn(
                      "flex cursor-pointer flex-col gap-2 rounded-lg border p-4 transition",
                      goals.includes(goal.id)
                        ? "border-[#d4af37] bg-[#fffdf8]"
                        : "border-[#e0d8c9] hover:border-[#d4af37]"
                    )}
                  >
                    <Checkbox
                      checked={goals.includes(goal.id)}
                      onChange={() => toggleGoal(goal.id)}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1b1c1c]">{goal.title}</p>
                      <p className="mt-1 text-xs text-[#6d6a66]">{goal.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Outreach */}
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                Preferred Outreach
              </h2>
              <div className="mt-4 space-y-3">
                <Checkbox
                  label="Receive regular email digests of top candidates."
                  checked={emailDigests}
                  onChange={(e) => setEmailDigests(e.target.checked)}
                  className="rounded-lg border border-[#e0d8c9] p-4"
                />
                <Checkbox
                  label="Allow students to send direct inquiries."
                  checked={directInquiries}
                  onChange={(e) => setDirectInquiries(e.target.checked)}
                  className="rounded-lg border border-[#e0d8c9] p-4"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-[#e0d8c9]/40 pt-6">
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
