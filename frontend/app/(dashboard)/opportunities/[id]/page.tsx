"use client";

import { useParams } from "next/navigation";
import {
  MapPin,
  Clock,
  Wallet,
  CheckCircle2,
  Briefcase,
  Users,
  CalendarClock,
  Building2,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { DonutProgress } from "@/components/ui/donut-progress/DonutProgress";
import type { ApplicationStatus } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const STATUS_LABEL: Record<ApplicationStatus, string> = {
  applied: "Applied",
  under_review: "Under Review",
  interview_scheduled: "Interview Scheduled",
  accepted: "Accepted",
  declined: "Declined",
};

const STATUS_TONE: Record<ApplicationStatus, "neutral" | "success" | "warning" | "error"> = {
  applied: "neutral",
  under_review: "warning",
  interview_scheduled: "primary" as never,
  accepted: "success",
  declined: "error",
};

function LearnerOpportunityDetail({ id }: { id: number }) {
  const opportunity = useAsync(() => api.getOpportunity(id), [id]);
  const applications = useAsync(() => api.myApplications(), []);

  const alreadyApplied = (applications.data ?? []).some(
    (a) => a.opportunity_title === opportunity.data?.title
  );

  if (opportunity.isLoading) return <p className="text-base text-[#6d6a66]">Loading…</p>;
  const o = opportunity.data;
  if (!o) return <p className="text-base text-[#ba1a1a]">Opportunity not found.</p>;

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6d6a66]">
        <button onClick={() => window.history.back()} className="hover:text-[#735c00]">
          ← Back
        </button>
        <span>/</span>
        <span>{o.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* Company & Title */}
          <Card className="flex items-start gap-6 p-8">
            <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl bg-[#f5f3f3]">
              <span className="font-['Hanken_Grotesk'] text-2xl font-bold text-[#735c00]">
                {o.company_name?.[0] ?? "?"}
              </span>
            </div>
            <div>
              <h1 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                {o.title}
              </h1>
              <p className="mt-1 text-base text-[#6d6a66]">{o.company_name}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {o.location && (
                  <Badge className="bg-[#f5f3f3] text-[#6d6a66]">
                    <MapPin className="mr-1 h-3 w-3" /> {o.location}
                  </Badge>
                )}
                <Badge className="bg-[#f5f3f3] text-[#6d6a66] capitalize">
                  <Briefcase className="mr-1 h-3 w-3" /> {o.work_mode}
                </Badge>
              </div>
            </div>
          </Card>

          {/* About the Role */}
          <Card className="p-8">
            <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
              About the Role
            </h2>
            <p className="mt-4 text-base leading-relaxed whitespace-pre-line text-[#6d6a66]">
              {o.description || "No description provided yet."}
            </p>
          </Card>

          {/* Requirements */}
          {o.required_skills.length > 0 && (
            <Card className="p-8">
              <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
                Requirements
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {o.required_skills.map((skill) => (
                  <li key={skill} className="flex items-center gap-3 text-base text-[#1b1c1c]">
                    <CheckCircle2 className="h-5 w-5 text-[#735c00]" /> {skill}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="h-fit">
          <Card className="p-6">
            {alreadyApplied ? (
              <p className="flex items-center gap-2 text-sm font-semibold text-[#735c00]">
                <CheckCircle2 className="h-5 w-5" /> Application submitted!
              </p>
            ) : (
              <Button
                className="h-12 w-full bg-[#d4af37] font-semibold text-[#1b1c1c] hover:bg-[#c9a32e]"
                href={`/opportunities/${id}/apply`}
              >
                Apply for Internship
              </Button>
            )}

            <dl className="mt-6 space-y-4 border-t border-[#e0d8c9]/40 pt-6 text-base">
              {o.application_deadline && (
                <div className="flex justify-between">
                  <dt className="flex items-center gap-2 text-[#6d6a66]">
                    <CalendarClock className="h-4 w-4" /> Deadline
                  </dt>
                  <dd className="font-semibold text-[#1b1c1c]">
                    {formatDate(o.application_deadline)}
                  </dd>
                </div>
              )}
              {o.duration && (
                <div className="flex justify-between">
                  <dt className="flex items-center gap-2 text-[#6d6a66]">
                    <Clock className="h-4 w-4" /> Duration
                  </dt>
                  <dd className="font-semibold text-[#1b1c1c]">{o.duration}</dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="flex items-center gap-2 text-[#6d6a66]">
                  <Wallet className="h-4 w-4" /> Stipend
                </dt>
                <dd className="font-semibold text-[#1b1c1c]">
                  {o.stipend_provided
                    ? `${o.stipend_currency} ${o.stipend_amount ?? "—"}/mo`
                    : "Unpaid"}
                </dd>
              </div>
            </dl>
          </Card>
        </div>
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
    <div className="flex flex-col gap-8">
      {/* Breadcrumb & Header */}
      <div>
        <p className="text-sm text-[#6d6a66]">Opportunities &gt; {opportunity.data?.title}</p>
        <h1 className="mt-1 font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
          Applicant Review
        </h1>
      </div>

      {/* Applicants Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {applicants.isLoading ? (
          <p className="text-base text-[#6d6a66]">Loading applicants…</p>
        ) : applicants.data && applicants.data.length > 0 ? (
          applicants.data.map((applicant) => (
            <Card key={applicant.id} className="p-6">
              {/* Top: Avatar & Match */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={applicant.applicant_name}
                    src={applicant.applicant_avatar}
                    size={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-base font-semibold text-[#1b1c1c]">
                      {applicant.applicant_name}
                    </p>
                    <p className="text-sm text-[#6d6a66]">{applicant.institution}</p>
                  </div>
                </div>
                {applicant.match_score != null && (
                  <DonutProgress percent={Math.round(applicant.match_score)} size={52} />
                )}
              </div>

              {/* Education & Skills */}
              <div className="mt-4 flex flex-col gap-1 text-sm text-[#6d6a66]">
                {applicant.education && (
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-[#735c00]" /> {applicant.education}
                  </span>
                )}
                {applicant.skills.length > 0 && (
                  <span className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-[#735c00]" /> {applicant.skills.join(", ")}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="mt-3">
                <Badge tone={STATUS_TONE[applicant.status]} dot>
                  {STATUS_LABEL[applicant.status]}
                </Badge>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2 border-t border-[#e0d8c9]/40 pt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="bg-[#1b1c1c] font-semibold"
                  href={`/interviews/propose/${applicant.id}`}
                >
                  Schedule
                </Button>
                <Button size="sm" variant="ghost" onClick={() => decline(applicant.id)}>
                  Decline
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-base text-[#6d6a66]">No applicants yet.</p>
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
