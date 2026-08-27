"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, LinkIcon, UploadCloud, X } from "lucide-react";
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
      // Goes through the storage provider abstraction — Supabase Storage
      // when SUPABASE_ENABLED=true, otherwise local disk. Either way the
      // resulting filename gets attached to the application.
      const result = await api.uploadFile(file);
      setResumeFilename(result.filename);
    } catch {
      setResumeFilename(file.name); // fall back to just the filename if upload fails
    } finally {
      setIsUploadingResume(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-lg flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-label-md text-on-surface-variant hover:text-primary flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <span className="text-headline-md text-primary">Lexep</span>
        <Link
          href={`/opportunities/${opportunityId}`}
          className="text-label-md text-on-surface-variant hover:text-primary flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Cancel
        </Link>
      </div>

      <div className="mb-lg text-center">
        <h1 className="text-headline-lg text-on-background">Apply for Internship</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          {opportunity.data
            ? `Applying to ${opportunity.data.title} at ${opportunity.data.company_name}`
            : "Complete your profile to be considered for this opportunity."}
        </p>
      </div>

      <div className="mb-lg flex items-center">
        {STEPS.map((label, i) => {
          const index = i + 1;
          const done = index < step;
          const active = index === step;
          return (
            <div key={label} className="flex flex-1 flex-col items-center last:flex-none">
              <div className="flex w-full items-center">
                <span
                  className={cn(
                    "text-label-md flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                    done || active
                      ? "bg-primary-container text-on-primary-container"
                      : "bg-surface-container-high text-on-surface-variant"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : index}
                </span>
                {index !== STEPS.length && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1",
                      done ? "bg-primary-container" : "bg-surface-container-high"
                    )}
                  />
                )}
              </div>
              <span className="text-label-sm text-on-surface-variant mt-2 text-center">
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <div className="card-level1 p-md">
        {step === 1 && (
          <div className="gap-md flex flex-col">
            <div>
              <h2 className="text-headline-md text-on-background">Step 1: Professional Details</h2>
              <p className="text-body-md text-on-surface-variant">
                Provide your educational background and initial motivations.
              </p>
            </div>
            <Select
              label="Highest Qualification"
              value={qualification}
              onChange={(e) => setQualification(e.target.value)}
            >
              <option value="">Select your qualification level</option>
              <option>High School</option>
              <option>Undergraduate</option>
              <option>Bachelor&apos;s Degree</option>
              <option>Master&apos;s Degree</option>
            </Select>
            <Select
              label="Years of Relevant Experience"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
            >
              <option value="">Select years of experience</option>
              <option>0-1 years</option>
              <option>1-3 years</option>
              <option>3-5 years</option>
              <option>5+ years</option>
            </Select>
            <Textarea
              label="Why are you interested in this role?"
              placeholder="Share your motivation, what you hope to learn, and how your goals align with this position…"
              hint="Minimum 50 words recommended"
              value={whyInterested}
              onChange={(e) => setWhyInterested(e.target.value)}
              className="min-h-[140px]"
            />
          </div>
        )}

        {step === 2 && (
          <div className="gap-md flex flex-col">
            <h2 className="text-headline-md text-on-background">Experience &amp; Portfolio</h2>
            <Input
              label="Portfolio Link (URL)"
              placeholder="https://yourportfolio.com"
              icon={<LinkIcon className="h-4 w-4" />}
              hint="Please provide a link to your online portfolio, Behance, or Dribbble."
              value={portfolioLink}
              onChange={(e) => setPortfolioLink(e.target.value)}
            />
            <div>
              <p className="text-label-md text-on-surface mb-1.5">Upload Resume</p>
              <label className="border-outline-variant bg-surface-container-low py-xl flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-center">
                <UploadCloud className="text-outline h-8 w-8" />
                <span className="text-label-md text-primary">Upload a file</span>
                <span className="text-label-sm text-on-surface-variant">
                  or drag and drop — PDF, DOC, DOCX up to 10MB
                </span>
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => handleResumeUpload(e.target.files?.[0])}
                />
              </label>
              {isUploadingResume && (
                <p className="text-label-sm text-on-surface-variant mt-2">Uploading…</p>
              )}
              {resumeFilename && !isUploadingResume && (
                <p className="text-label-sm text-primary mt-2">{resumeFilename} selected</p>
              )}
            </div>
            <Textarea
              label="Additional Information (Optional)"
              placeholder="Tell us anything else you'd like us to know about your experience…"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="gap-md flex flex-col">
            <h2 className="text-headline-md text-on-background">Review &amp; Submit</h2>
            <p className="text-body-md text-on-surface-variant">
              Ensure your details are correct before applying.
            </p>

            <div className="bg-surface-container-low p-md rounded-md">
              <h3 className="text-headline-md text-on-background">Application Summary</h3>
              <div className="text-body-md mt-3 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-label-sm text-on-surface-variant">Full Name</p>
                  <p className="text-on-background">{user?.full_name}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Email Address</p>
                  <p className="text-on-background">{user?.email}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Qualification</p>
                  <p className="text-on-background">{qualification || "—"}</p>
                </div>
                <div>
                  <p className="text-label-sm text-on-surface-variant">Experience</p>
                  <p className="text-on-background">{yearsExperience || "—"}</p>
                </div>
                {portfolioLink && (
                  <div className="sm:col-span-2">
                    <p className="text-label-sm text-on-surface-variant">Portfolio Link</p>
                    <p className="text-primary underline">{portfolioLink}</p>
                  </div>
                )}
                {resumeFilename && (
                  <div className="sm:col-span-2">
                    <p className="text-label-sm text-on-surface-variant">Uploaded Documents</p>
                    <p className="border-outline-variant bg-surface-container-lowest mt-1 flex items-center gap-2 rounded-md border px-3 py-2">
                      {resumeFilename} <Check className="text-primary h-4 w-4" />
                    </p>
                  </div>
                )}
              </div>
            </div>

            <Checkbox
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              label="I confirm that all the information provided is accurate and true to the best of my knowledge. I understand that any false statements may result in disqualification."
            />
          </div>
        )}

        <div className="mt-lg border-outline-variant/40 pt-md flex items-center justify-between border-t">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              <ArrowLeft className="h-4 w-4" /> Edit Details
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)}>
              Next: {STEPS[step]} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!confirmed || isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit Application"}{" "}
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
