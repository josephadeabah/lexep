"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  ExternalLink,
  Building2,
  GraduationCap,
  BadgeCheck,
} from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { Textarea } from "@/components/ui/Textarea";
import { Checkbox } from "@/components/ui/Checkbox";

const CHECKLIST_ITEMS: {
  key: "identity_verified" | "academic_verified" | "professional_verified";
  label: string;
  description: string;
}[] = [
  {
    key: "identity_verified",
    label: "Identity Verification",
    description: "Valid ID or Passport copy matches profile details.",
  },
  {
    key: "academic_verified",
    label: "Academic Credentials",
    description: "Degree certificate verified against university records.",
  },
  {
    key: "professional_verified",
    label: "Professional Registration",
    description: "Professional registration is active and in good standing.",
  },
];

export default function AdminApplicationReviewPage() {
  const params = useParams<{ userId: string }>();
  const router = useRouter();
  const userId = Number(params.userId);

  const application = useAsync(() => api.adminGetMentorApplication(userId), [userId]);
  const packages = useAsync(() => api.mentorPackages(userId), [userId]);

  const [note, setNote] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [deciding, setDeciding] = useState(false);

  async function toggleChecklistItem(key: string, value: boolean) {
    await api.adminUpdateChecklist(userId, { [key]: value });
    application.refetch();
  }

  async function saveNote() {
    setSavingNote(true);
    try {
      await api.adminSaveNote(userId, note);
      application.refetch();
    } finally {
      setSavingNote(false);
    }
  }

  async function decide(action: "approve" | "decline" | "request-info") {
    setDeciding(true);
    try {
      if (action === "approve") await api.adminApprove(userId);
      else if (action === "decline") await api.adminDecline(userId);
      else await api.adminRequestInfo(userId);
      router.push("/admin/applications");
    } finally {
      setDeciding(false);
    }
  }

  if (application.isLoading)
    return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const a = application.data;
  if (!a) return <p className="text-body-md text-error">Application not found.</p>;

  const checklist = a.credential_checklist || {};

  return (
    <div>
      <button
        onClick={() => router.push("/admin/applications")}
        className="text-label-md text-on-surface-variant hover:text-primary mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Applications
      </button>

      <div className="mb-lg flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-headline-lg text-on-background">{a.user.full_name}</h1>
            <Badge tone="warning">Pending Review</Badge>
          </div>
          <p className="text-body-md text-on-surface-variant mt-1">
            {a.title} at <span className="text-on-background">{a.company}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="border-error text-error"
            onClick={() => decide("decline")}
            disabled={deciding}
          >
            Decline
          </Button>
          <Button variant="secondary" onClick={() => decide("request-info")} disabled={deciding}>
            Request More Info
          </Button>
          <Button onClick={() => decide("approve")} disabled={deciding}>
            Approve
          </Button>
        </div>
      </div>

      <div className="gap-md grid lg:grid-cols-[320px_1fr]">
        <div className="gap-md flex flex-col">
          <Card className="text-center">
            <Avatar name={a.user.full_name} src={a.user.avatar_url} size={96} className="mx-auto" />
            <p className="text-headline-md text-on-background mt-3">{a.user.full_name}</p>
            <p className="text-body-md text-on-surface-variant">{a.location}</p>
            <div className="border-outline-variant/40 mt-4 grid grid-cols-2 gap-3 border-t pt-3 text-left">
              <div>
                <p className="text-label-sm text-on-surface-variant">Experience</p>
                <p className="text-label-md text-on-background">{a.years_experience}</p>
              </div>
              <div>
                <p className="text-label-sm text-on-surface-variant">Focus</p>
                <p className="text-label-md text-on-background">{a.focus_area}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              {a.linkedin_url && (
                <Button href={a.linkedin_url} variant="ghost" size="sm">
                  LinkedIn Profile <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </Card>

          {a.education.length > 0 && (
            <Card>
              <h2 className="text-headline-md text-on-background flex items-center gap-2">
                <GraduationCap className="h-4 w-4" /> Education &amp; Affiliations
              </h2>
              <ul className="mt-3 flex flex-col gap-3">
                {a.education.map((e, i) => (
                  <li key={i}>
                    <p className="text-label-md text-on-background">{e.degree}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {e.institution} · {e.year}
                    </p>
                  </li>
                ))}
                {a.credentials.map((c, i) => (
                  <li key={`c-${i}`} className="flex items-start gap-2">
                    <BadgeCheck className="text-primary mt-0.5 h-4 w-4" />
                    <p className="text-label-sm text-on-surface-variant">{c.label}</p>
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        <div className="gap-md flex flex-col">
          <Card>
            <h2 className="text-headline-md text-on-background">Professional Statement</h2>
            <p className="text-body-md text-on-surface-variant mt-3 whitespace-pre-line">{a.bio}</p>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-headline-md text-on-background">Proposed Mentorship Packages</h2>
              <span className="text-label-sm text-on-surface-variant">
                {packages.data?.length ?? 0} Packages Proposed
              </span>
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {(packages.data ?? []).map((pkg) => (
                <div key={pkg.id} className="border-outline-variant rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-label-md text-on-background">{pkg.title}</p>
                    <p className="text-label-md text-primary">
                      {pkg.currency} {pkg.price}
                    </p>
                  </div>
                  <p className="text-label-sm text-on-surface-variant mt-2">{pkg.description}</p>
                  <p className="text-label-sm text-on-surface-variant mt-2">
                    {pkg.duration_minutes} Minutes
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-primary-container border-l-2">
            <h2 className="text-headline-md text-on-background">Credential Verification</h2>
            <p className="text-label-sm text-on-surface-variant">
              Admin checklist to verify the applicant&apos;s submitted documents before approval.
            </p>
            <div className="mt-3 flex flex-col gap-3">
              {CHECKLIST_ITEMS.map((item) => (
                <div key={item.key} className="bg-surface-container-low rounded-md p-4">
                  <Checkbox
                    checked={!!checklist[item.key]}
                    onChange={(e) => toggleChecklistItem(item.key, e.target.checked)}
                    label={item.label}
                    description={item.description}
                  />
                  <button className="text-label-sm text-primary mt-2 flex items-center gap-1 pl-8 hover:underline">
                    <FileText className="h-3.5 w-3.5" /> View Document
                  </button>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="text-headline-md text-on-background">Internal Admin Notes</h2>
            {a.admin_notes && (
              <p className="bg-surface-container-low text-body-md text-on-surface-variant mt-2 rounded-md p-3 whitespace-pre-line">
                {a.admin_notes}
              </p>
            )}
            <div className="mt-3">
              <Textarea
                placeholder="Add internal notes about this application… (Not visible to applicant)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <Button
              className="mt-3"
              variant="secondary"
              onClick={saveNote}
              disabled={savingNote || !note}
            >
              {savingNote ? "Saving…" : "Save Note"}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
