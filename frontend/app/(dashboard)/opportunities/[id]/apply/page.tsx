"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Link as LinkIcon,
  UploadCloud,
  X,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/select/Select";
import { Input } from "@/components/ui/input/Input";
import { Textarea } from "@/components/ui/text-area/Textarea";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { useAuthStore } from "@/lib/auth-store";

const STEPS = ["Professional Details", "Experience & Portfolio", "Review & Submit"];

export default function ApplyForInternshipPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const opportunityId = Number(params.id);
  const opportunity = useAsync(() => api.getOpportunity(opportunityId), [opportunityId]);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [qualification, setQualification] = useState("");
  const [yearsExperience, setYearsExperience] = useState("");
  const [whyInterested, setWhyInterested] = useState("");

  const [portfolioLink, setPortfolioLink] = useState("");
  const [resumeFilename, setResumeFilename] = useState("");
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [additionalInfo, setAdditionalInfo] = useState("");

  const [confirmed, setConfirmed] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await api.applyToOpportunity(opportunityId, {
        qualification,
        years_experience: yearsExperience,
        why_interested: whyInterested,
        portfolio_link: portfolioLink,
        resume_filename: resumeFilename,
        additional_info: additionalInfo,
      });
      router.push(`/opportunities/${opportunityId}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResumeUpload(file: File | undefined) {
    if (!file) return;
    setIsUploadingResume(true);
    try {
      const result = await api.uploadFile(file);
      setResumeFilename(result.filename);
    } catch {
      setResumeFilename(file.name);
    } finally {
      setIsUploadingResume(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8]">
      {/* Header */}
      <header className="border-b border-[#e0d8c9]/40 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <Link href="/" className="font-['Hanken_Grotesk'] text-xl font-bold text-[#735c00]">
            ArchitectAfrica
          </Link>
          <Link
            href={`/opportunities/${opportunityId}`}
            className="flex items-center gap-2 text-sm font-semibold text-[#6d6a66] hover:text-[#735c00]"
          >
            <X className="h-4 w-4" /> Cancel Application
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#6d6a66] hover:text-[#735c00]"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
            Apply for Internship
          </h1>
          <p className="mt-2 text-base text-[#6d6a66]">
            Complete your profile to be considered for this opportunity.
          </p>
        </div>

        {/* Stepper */}
        <div className="mx-auto mb-12 flex max-w-2xl items-center">
          {STEPS.map((label, i) => {
            const index = i + 1;
            const done = index < step;
            const active = index === step;
            return (
              <div key={label} className="flex flex-1 flex-col items-center last:flex-none">
                <div className="flex w-full items-center">
                  <span
                    className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      done || active ? "bg-[#d4af37] text-[#1b1c1c]" : "bg-[#f5f3f3] text-[#6d6a66]"
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : index}
                  </span>
                  {index !== STEPS.length && (
                    <div
                      className={cn(
                        "mx-3 h-0.5 flex-1 rounded-full",
                        done ? "bg-[#d4af37]" : "bg-[#e0d8c9]"
                      )}
                    />
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-center text-xs font-semibold",
                    active ? "text-[#1b1c1c]" : "text-[#6d6a66]"
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Form Card */}
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e0d8c9] bg-white p-8 shadow-sm">
          {/* STEP 1: Professional Details */}
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
                  Step 1: Professional Details
                </h2>
                <p className="mt-1 text-sm text-[#6d6a66]">
                  Provide your educational background and initial motivations.
                </p>
              </div>

              <div>
                <Select
                  label="Highest Qualification"
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="h-12 rounded-lg border-[#e0d8c9]"
                >
                  <option value="">Select your qualification level</option>
                  <option>High School</option>
                  <option>Undergraduate</option>
                  <option>Bachelor&apos;s Degree</option>
                  <option>Master&apos;s Degree</option>
                </Select>
              </div>

              <div>
                <Select
                  label="Years of Relevant Experience"
                  value={yearsExperience}
                  onChange={(e) => setYearsExperience(e.target.value)}
                  className="h-12 rounded-lg border-[#e0d8c9]"
                >
                  <option value="">Select years of experience</option>
                  <option>0-1 years</option>
                  <option>1-3 years</option>
                  <option>3-5 years</option>
                  <option>5+ years</option>
                </Select>
              </div>

              <div>
                <Textarea
                  label="Why are you interested in this role?"
                  placeholder="Share your motivation, what you hope to learn, and how your goals align with this position..."
                  hint="Minimum 50 words recommended"
                  value={whyInterested}
                  onChange={(e) => setWhyInterested(e.target.value)}
                  className="min-h-[160px] rounded-lg border-[#e0d8c9]"
                />
              </div>

              {/* Footer */}
              <div className="mt-2 flex justify-end border-t border-[#e0d8c9]/40 pt-6">
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-[#d4af37] font-semibold"
                >
                  Next: Experience & Portfolio <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Experience & Portfolio */}
          {step === 2 && (
            <div className="flex flex-col gap-8">
              <div>
                <h2 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.02em] text-[#1b1c1c]">
                  Experience &amp; Portfolio
                </h2>
              </div>

              <div>
                <Input
                  label="Portfolio Link (URL)"
                  placeholder="https://yourportfolio.com"
                  icon={<LinkIcon className="h-4 w-4" />}
                  hint="Please provide a link to your online portfolio, Behance, or Dribbble."
                  value={portfolioLink}
                  onChange={(e) => setPortfolioLink(e.target.value)}
                  className="h-12 rounded-lg border-[#e0d8c9]"
                />
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-[#1b1c1c]">
                  Upload Resume <span className="text-[#ba1a1a]">*</span>
                </p>
                <label className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-[#e0d8c9] bg-[#fbf9f8] px-6 py-12 text-center transition hover:border-[#d4af37]">
                  <UploadCloud className="h-10 w-10 text-[#6d6a66]" />
                  <span className="text-base font-semibold text-[#735c00]">
                    Upload a file or drag and drop
                  </span>
                  <span className="text-sm text-[#6d6a66]">PDF, DOC, DOCX up to 10MB</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => handleResumeUpload(e.target.files?.[0])}
                  />
                </label>
                {isUploadingResume && <p className="mt-2 text-sm text-[#6d6a66]">Uploading…</p>}
                {resumeFilename && !isUploadingResume && (
                  <div className="mt-2 flex items-center gap-2 rounded-lg border border-[#e0d8c9] p-3">
                    <FileText className="h-4 w-4 text-[#735c00]" />
                    <span className="text-sm font-semibold text-[#1b1c1c]">{resumeFilename}</span>
                    <Check className="h-4 w-4 text-[#735c00]" />
                  </div>
                )}
              </div>

              <div>
                <Textarea
                  label="Additional Information (Optional)"
                  placeholder="Tell us anything else you'd like us to know about your experience..."
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="min-h-[120px] rounded-lg border-[#e0d8c9]"
                />
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="border-[#e0d8c9]"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to Step 1
                </Button>
                <Button
                  onClick={() => setStep((s) => s + 1)}
                  className="bg-[#d4af37] font-semibold"
                >
                  Continue to Review <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Review & Submit */}
          {step === 3 && (
            <div className="flex flex-col gap-8">
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f7edc9]">
                  <Check className="h-8 w-8 text-[#735c00]" />
                </div>
                <h2 className="mt-4 font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                  Review &amp; Submit
                </h2>
                <p className="mt-2 text-base text-[#6d6a66]">
                  Ensure your details are correct before applying.
                </p>
              </div>

              {/* Application Summary */}
              <div className="rounded-xl bg-[#f5f3f3] p-8">
                <h3 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  Application Summary
                </h3>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#6d6a66] uppercase">
                      Full Name
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1b1c1c]">{user?.full_name}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#6d6a66] uppercase">
                      Email Address
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1b1c1c]">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#6d6a66] uppercase">
                      Qualification
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1b1c1c]">
                      {qualification || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold tracking-wider text-[#6d6a66] uppercase">
                      Experience
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1b1c1c]">
                      {yearsExperience || "—"}
                    </p>
                  </div>
                  {portfolioLink && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold tracking-wider text-[#6d6a66] uppercase">
                        Portfolio Link
                      </p>
                      <a
                        href={portfolioLink}
                        className="mt-1 flex items-center gap-2 text-base font-semibold text-[#735c00] hover:underline"
                      >
                        <LinkIcon className="h-4 w-4" /> {portfolioLink}
                      </a>
                    </div>
                  )}
                  {resumeFilename && (
                    <div className="sm:col-span-2">
                      <p className="text-xs font-semibold tracking-wider text-[#6d6a66] uppercase">
                        Uploaded Documents
                      </p>
                      <div className="mt-2 flex items-center gap-3 rounded-lg border border-[#e0d8c9] bg-white p-3">
                        <FileText className="h-4 w-4 text-[#735c00]" />
                        <span className="text-sm font-semibold text-[#1b1c1c]">
                          {resumeFilename}
                        </span>
                        <Check className="ml-auto h-5 w-5 text-[#d4af37]" />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Confirmation */}
              <Checkbox
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                label="I confirm that all the information provided is accurate and true to the best of my knowledge. I understand that any false statements may result in disqualification."
                className="text-sm text-[#6d6a66]"
              />

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
                <Button
                  variant="outline"
                  onClick={() => setStep((s) => s - 1)}
                  className="border-[#e0d8c9]"
                >
                  <ArrowLeft className="h-4 w-4" /> Edit Details
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!confirmed || isSubmitting}
                  className="bg-[#d4af37] font-semibold"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
