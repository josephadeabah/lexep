"use client";

import { useParams } from "next/navigation";
import { MapPin, Clock, Wallet, CheckCircle2 } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { DonutProgress } from "@/components/ui/DonutProgress";
import type { ApplicationStatus } from "@/lib/types";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  interview_scheduled: "Interview Scheduled",
  accepted: "Accepted",
  declined: "Declined",
};

function LearnerOpportunityDetail({ id }: { id: number }) {
  const opportunity = useAsync(() => api.getOpportunity(id), [id]);
  const applications = useAsync(() => api.myApplications(), []);

  const alreadyApplied = (applications.data ?? []).some(
    (a) => a.opportunity_title === opportunity.data?.title
  );

  if (opportunity.isLoading)
    return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const o = opportunity.data;
  if (!o) return <p className="text-body-md text-error">Opportunity not found.</p>;

  return (
    <div className="grid gap-md lg:grid-cols-[1fr_320px]">
      <div>
        <Card className="mb-md flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-surface-container-high text-headline-md text-on-surface">
            {o.company_name?.[0] ?? "?"}
          </div>
          <div>
            <h1 className="text-headline-lg text-on-background">{o.title}</h1>
            <p className="text-body-md text-on-surface-variant">{o.company_name}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {o.location && <Badge>{o.location}</Badge>}
              <Badge className="capitalize">{o.work_mode}</Badge>
            </div>
          </div>
        </Card>

        <Card className="mb-md">
          <h2 className="text-headline-md text-on-background">About the Role</h2>
          <p className="mt-3 whitespace-pre-line text-body-md text-on-surface-variant">
            {o.description || "No description provided yet."}
          </p>
        </Card>

        {o.required_skills.length > 0 && (
          <Card>
            <h2 className="text-headline-md text-on-background">Requirements</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {o.required_skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-body-md text-on-surface">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {skill}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      <div>
        <Card>
          {alreadyApplied ? (
            <p className="flex items-center gap-2 text-label-md text-primary">
              <CheckCircle2 className="h-5 w-5" /> Application submitted!
            </p>
          ) : (
            <Button className="w-full" href={`/opportunities/${id}/apply`}>
              Apply for Internship
            </Button>
          )}

          <dl className="mt-md flex flex-col gap-3 border-t border-outline-variant/40 pt-md text-body-md">
            {o.application_deadline && (
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Deadline</dt>
                <dd className="text-on-background">
                  {new Date(o.application_deadline).toLocaleDateString()}
                </dd>
              </div>
            )}
            {o.duration && (
              <div className="flex justify-between">
                <dt className="text-on-surface-variant">Duration</dt>
                <dd className="text-on-background">{o.duration}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-on-surface-variant">Stipend</dt>
              <dd className="text-on-background">
                {o.stipend_provided
                  ? `${o.stipend_currency} ${o.stipend_amount ?? "—"}/mo`
                  : "Unpaid"}
              </dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

function CompanyApplicantReview({ id }: { id: number }) {
  const opportunity = useAsync(() => api.getOpportunity(id), [id]);
  const applicants = useAsync(() => api.listApplicants(id), [id]);

  async function decline(applicationId: number) {
    await api.updateApplicationStatus(applicationId, "declined");
    applicants.refetch();
  }

  return (
    <div>
      <div className="mb-lg flex items-center justify-between">
        <div>
          <p className="text-label-sm text-on-surface-variant">
            Opportunities &gt; {opportunity.data?.title}
          </p>
          <h1 className="text-headline-lg text-on-background">Applicant Review</h1>
        </div>
      </div>

      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {applicants.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading applicants…</p>
        ) : applicants.data && applicants.data.length > 0 ? (
          applicants.data.map((applicant) => (
            <Card key={applicant.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={applicant.applicant_name}
                    src={applicant.applicant_avatar}
                    size={44}
                  />
                  <div>
                    <p className="text-label-md text-on-background">{applicant.applicant_name}</p>
                    <p className="text-label-sm text-on-surface-variant">{applicant.institution}</p>
                  </div>
                </div>
                {applicant.match_score != null && (
                  <DonutProgress percent={Math.round(applicant.match_score)} size={52} />
                )}
              </div>

              <div className="mt-3 flex flex-col gap-1 text-label-sm text-on-surface-variant">
                {applicant.education && <span>{applicant.education}</span>}
                {applicant.skills.length > 0 && <span>{applicant.skills.join(", ")}</span>}
              </div>

              <div className="mt-2">
                <Badge tone={applicant.status === "declined" ? "error" : "neutral"} dot>
                  {STATUS_LABEL[applicant.status]}
                </Badge>
              </div>

              <div className="mt-4 flex gap-2 border-t border-outline-variant/40 pt-3">
                <Button size="sm" variant="secondary" href={`/interviews/propose/${applicant.id}`}>
                  Schedule
                </Button>
                <Button size="sm" variant="ghost" onClick={() => decline(applicant.id)}>
                  Decline
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-body-md text-on-surface-variant">No applicants yet.</p>
        )}
      </div>
    </div>
  );
}

export default function OpportunityDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Number(params.id);
  const role = useAuthStore((s) => s.user?.role);

  if (role === "company") return <CompanyApplicantReview id={id} />;
  return <LearnerOpportunityDetail id={id} />;
}
