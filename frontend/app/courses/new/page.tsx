"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, HelpCircle, Check, UploadCloud, LinkIcon, Users, Eye, Wallet, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { SharedShell } from "@/components/layout/SharedShell";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Radio } from "@/components/ui/Radio";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";

const STEPS = ["Basics", "Media", "Settings"];

function ContentCreatorContent() {
  const router = useRouter();
  const role = useAuthStore((s) => s.user?.role);

  useEffect(() => {
    if (role && role !== "admin" && role !== "company") router.replace("/courses");
  }, [role, router]);

  const [step, setStep] = useState(1);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1
  const [contentType, setContentType] = useState<"course_module" | "assessment">("course_module");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  // Step 2
  const [externalLink, setExternalLink] = useState("");
  const [videoFilename, setVideoFilename] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Step 3
  const [isPublic, setIsPublic] = useState(true);
  const [enrollmentLimit, setEnrollmentLimit] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [price, setPrice] = useState("0.00");
  const [issueCertificate, setIssueCertificate] = useState(true);

  async function handleContinueToMedia() {
    setIsSubmitting(true);
    try {
      const course = await api.createCourseBasics({
        content_type: contentType,
        title,
        description,
        category,
      });
      setCourseId(course.id);
      setStep(2);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVideoUpload(file: File | undefined) {
    if (!file) return;
    setIsUploading(true);
    try {
      const result = await api.uploadFile(file);
      setVideoFilename(result.filename);
    } catch {
      setVideoFilename(file.name);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleContinueToSettings() {
    if (!courseId) return;
    setIsSubmitting(true);
    try {
      if (videoFilename || externalLink) {
        await api.addCourseModule(courseId, {
          title: "Module 1",
          video_url: videoFilename || null,
          external_link: externalLink || null,
        });
      }
      setStep(3);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handlePublish() {
    if (!courseId) return;
    setIsSubmitting(true);
    try {
      await api.updateCourseSettings(courseId, {
        is_public: isPublic,
        enrollment_limit: enrollmentLimit ? Number(enrollmentLimit) : null,
        is_paid: isPaid,
        price: isPaid ? Number(price || 0) : 0,
        issue_certificate: issueCertificate,
      });
      await api.publishCourse(courseId);
      router.push("/courses");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/courses" className="mb-4 flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="mb-lg">
        <h1 className="text-headline-lg text-on-background">Create New Content</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Follow the steps below to upload a new course or assessment to the platform.
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
                    "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-label-md",
                    done || active ? "bg-primary-container text-on-primary-container" : "bg-surface-container-high text-on-surface-variant"
                  )}
                >
                  {done ? <Check className="h-4 w-4" /> : index}
                </span>
                {index !== STEPS.length && (
                  <div className={cn("mx-2 h-0.5 flex-1", done ? "bg-primary-container" : "bg-surface-container-high")} />
                )}
              </div>
              <span className="mt-2 text-label-sm text-on-surface-variant">{label}</span>
            </div>
          );
        })}
      </div>

      <div className="card-level1 p-md">
        {step === 1 && (
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-md text-on-background">Basic Information</h2>
            <div>
              <p className="mb-2 text-label-md text-on-surface">Content Type</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setContentType("course_module")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-md border p-6 transition",
                    contentType === "course_module" ? "border-primary-container bg-surface-container-low" : "border-outline-variant"
                  )}
                >
                  <BookOpen className="h-6 w-6 text-on-surface" />
                  <span className="text-label-md text-on-surface">Course Module</span>
                </button>
                <button
                  onClick={() => setContentType("assessment")}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-md border p-6 transition",
                    contentType === "assessment" ? "border-primary-container bg-surface-container-low" : "border-outline-variant"
                  )}
                >
                  <HelpCircle className="h-6 w-6 text-on-surface" />
                  <span className="text-label-md text-on-surface">Assessment</span>
                </button>
              </div>
            </div>
            <Input label="Title" placeholder="e.g., Introduction to Sustainable Architecture" value={title} onChange={(e) => setTitle(e.target.value)} />
            <Textarea label="Description" placeholder="Provide a brief overview of the content…" value={description} onChange={(e) => setDescription(e.target.value)} />
            <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Select a category</option>
              <option>Core Foundation</option>
              <option>Advanced Seminar</option>
              <option>Practicum</option>
              <option>Internal</option>
            </Select>
            <div className="mt-md flex items-center justify-between border-t border-outline-variant/40 pt-md">
              <Link href="/courses" className="text-label-md text-on-surface-variant hover:text-primary">
                Cancel
              </Link>
              <Button onClick={handleContinueToMedia} disabled={!title || isSubmitting}>
                {isSubmitting ? "Saving…" : "Continue to Media"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-md text-on-background">Media Upload</h2>
            <p className="text-body-md text-on-surface-variant">Upload your primary video content or supporting documents for this module.</p>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-outline-variant bg-surface-container-low py-xl text-center">
              <UploadCloud className="h-8 w-8 text-outline" />
              <span className="text-label-md text-primary">Click to upload or drag and drop</span>
              <span className="text-label-sm text-on-surface-variant">MP4, PDF, DOCX (Max 500MB)</span>
              <input type="file" className="hidden" onChange={(e) => handleVideoUpload(e.target.files?.[0])} />
            </label>
            {isUploading && <p className="text-label-sm text-on-surface-variant">Uploading…</p>}
            {videoFilename && !isUploading && <p className="text-label-sm text-primary">{videoFilename} uploaded</p>}

            <p className="mt-md text-headline-md text-on-background">External Integrations</p>
            <Input
              label="External Resource Link"
              placeholder="e.g., YouTube URL, external PDF"
              icon={<LinkIcon className="h-4 w-4" />}
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
            />

            <div className="mt-md flex items-center justify-between border-t border-outline-variant/40 pt-md">
              <Button variant="ghost" onClick={() => setStep(1)}>
                <ArrowLeft className="h-4 w-4" /> Back to Basics
              </Button>
              <Button onClick={handleContinueToSettings} disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Continue to Review"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-md text-on-background">Final Settings</h2>
            <p className="text-body-md text-on-surface-variant">Configure visibility, pricing, and certification details before publishing your content.</p>

            <div className="rounded-md border border-outline-variant p-md">
              <p className="flex items-center gap-2 text-label-md text-on-background">
                <Eye className="h-4 w-4" /> Visibility &amp; Access
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-surface-container-low p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-label-md text-on-background">Public Course</span>
                    <button
                      onClick={() => setIsPublic((v) => !v)}
                      className={cn(
                        "flex h-6 w-11 items-center rounded-full px-0.5 transition",
                        isPublic ? "justify-end bg-primary-container" : "justify-start bg-outline-variant"
                      )}
                    >
                      <span className="h-5 w-5 rounded-full bg-white shadow" />
                    </button>
                  </div>
                  <p className="mt-1 text-label-sm text-on-surface-variant">Anyone on the Lexep platform can discover and enroll in this content.</p>
                </div>
                <Input
                  label="Enrollment Limit"
                  placeholder="e.g., 50"
                  icon={<Users className="h-4 w-4" />}
                  hint="Leave blank for unlimited."
                  value={enrollmentLimit}
                  onChange={(e) => setEnrollmentLimit(e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-md border border-outline-variant p-md">
              <p className="flex items-center gap-2 text-label-md text-on-background">
                <Wallet className="h-4 w-4" /> Pricing
              </p>
              <div className="mt-3 flex gap-md">
                <label className="flex items-center gap-2">
                  <Radio checked={!isPaid} onChange={() => setIsPaid(false)} /> Free Course
                </label>
                <label className="flex items-center gap-2">
                  <Radio checked={isPaid} onChange={() => setIsPaid(true)} /> Paid Course
                </label>
              </div>
              {isPaid && (
                <div className="mt-3 max-w-xs">
                  <Input label="Price (USD)" icon={<span className="text-body-md">$</span>} value={price} onChange={(e) => setPrice(e.target.value)} />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-md border border-outline-variant p-md">
              <div className="flex items-start gap-3">
                <Award className="mt-0.5 h-5 w-5 text-on-surface-variant" />
                <div>
                  <p className="text-label-md text-on-background">Issue Certificate on Completion</p>
                  <p className="text-label-sm text-on-surface-variant">
                    Automatically generate and issue a verified Lexep certificate when a student completes all required modules.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIssueCertificate((v) => !v)}
                className={cn(
                  "flex h-6 w-11 flex-shrink-0 items-center rounded-full px-0.5 transition",
                  issueCertificate ? "justify-end bg-primary-container" : "justify-start bg-outline-variant"
                )}
              >
                <span className="h-5 w-5 rounded-full bg-white shadow" />
              </button>
            </div>

            <div className="mt-md flex items-center justify-between border-t border-outline-variant/40 pt-md">
              <Button variant="ghost" onClick={() => setStep(2)}>
                Back to Media
              </Button>
              <Button onClick={handlePublish} disabled={isSubmitting}>
                {isSubmitting ? "Publishing…" : "Publish Content"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ContentCreatorPage() {
  return (
    <SharedShell>
      <ContentCreatorContent />
    </SharedShell>
  );
}
