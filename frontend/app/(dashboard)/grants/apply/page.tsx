"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";
import { api } from "@/lib/api";

const STEPS = ["Basic Info", "Details", "Documents"];

export default function GrantApplicationPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [amount, setAmount] = useState("");
  const [purpose, setPurpose] = useState("");
  const [details, setDetails] = useState("");
  const [documents, setDocuments] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await api.applyForGrant({
        amount_requested: Number(amount || 0),
        purpose,
        details,
        documents,
        status: "submitted",
      });
      router.push("/grants");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/grants"
        className="mb-4 flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Grants
      </Link>

      <div className="mb-lg text-center">
        <h1 className="text-headline-lg text-on-background">Grant Application</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Complete this form to apply for funding. Please ensure all information is accurate.
        </p>
      </div>

      <div className="card-level1 p-md">
        <div className="mb-lg flex items-center">
          {STEPS.map((label, i) => {
            const index = i + 1;
            const done = index < step;
            const active = index === step;
            return (
              <div key={label} className="flex flex-1 items-center last:flex-none">
                <div className="flex flex-col items-center gap-2">
                  <span
                    className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-full text-label-md",
                      done || active
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container-high text-on-surface-variant"
                    )}
                  >
                    {done ? <Check className="h-4 w-4" /> : index}
                  </span>
                  <span className="text-label-sm text-on-surface-variant">{label}</span>
                </div>
                {index !== STEPS.length && (
                  <div
                    className={cn(
                      "mx-2 h-0.5 flex-1",
                      done ? "bg-primary-container" : "bg-surface-container-high"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {step === 1 && (
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-md text-on-background">Funding Request</h2>
            <div className="grid gap-md sm:grid-cols-2">
              <Input
                label="Amount Requested (USD)"
                placeholder="e.g. 1500"
                icon={<span className="text-body-md">$</span>}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <Select
                label="Purpose of Grant"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              >
                <option value="">Select primary purpose</option>
                <option>Laptop / Equipment</option>
                <option>Internet Access</option>
                <option>Course Fees</option>
                <option>Certification Exam</option>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-md text-on-background">Tell us more</h2>
            <Textarea
              label="Why do you need this funding?"
              placeholder="Describe your current situation and how this grant would help your career journey…"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-md">
            <h2 className="text-headline-md text-on-background">Supporting Documents</h2>
            <p className="text-label-sm text-on-surface-variant">
              List any documents you can provide (transcripts, quotes, proof of enrollment).
            </p>
            <div className="flex flex-wrap gap-2">
              {documents.map((doc) => (
                <span
                  key={doc}
                  className="flex items-center gap-1 rounded-full bg-surface-container-high px-3 py-1 text-label-sm"
                >
                  {doc}
                  <button onClick={() => setDocuments((prev) => prev.filter((d) => d !== doc))}>
                    ×
                  </button>
                </span>
              ))}
              <input
                placeholder="Add a document name and press enter…"
                className="min-w-[220px] flex-1 rounded-md border border-outline-variant px-3 py-2 text-body-md outline-none focus:ring-2 focus:ring-primary-container"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.currentTarget.value.trim()) {
                    e.preventDefault();
                    setDocuments((prev) => [...prev, e.currentTarget.value.trim()]);
                    e.currentTarget.value = "";
                  }
                }}
              />
            </div>
            <Checkbox
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              label="I confirm that the information provided is accurate and I understand grants are awarded at Lexep's discretion."
            />
          </div>
        )}

        <div className="mt-lg flex items-center justify-between border-t border-outline-variant/40 pt-md">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button onClick={() => setStep((s) => s + 1)}>Next Step</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!agreed || isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit Application"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
