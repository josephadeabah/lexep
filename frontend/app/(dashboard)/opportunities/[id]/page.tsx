"use client";

import { useParams } from "next/navigation";
import { MapPin, Clock, Wallet, CheckCircle2, GraduationCap, Code2, Filter, ArrowUpDown, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { DonutProgress } from "@/components/ui/donut-progress/DonutProgress";
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
    return <p className="text-base text-[#6d6a66]">Loading…</p>;
  const o = opportunity.data;
  if (!o) return <p className="text-base text-[#ba1a1a]">Opportunity not found.</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-6">
        {/* Company & Title */}
        <Card className="flex items-start gap-4 p-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-md bg-[#f5f3f3] text-2xl font-bold text-[#1b1c1c]">
            {o.company_name?.[0] ?? "?"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
              {o.title}
            </h1>
            <p className="mt-1 text-base text-[#6d6a66]">{o.company_name}</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {o.location && (
                <Badge className="bg-[#f5f3f3] text-[#6d6a66]">
                  <MapPin className="mr-1 h-3 w-3" /> {o.location}
                </Badge>
              )}
              <Badge className="bg-[#f5f3f3] capitalize text-[#6d6a66]">
                {o.work_mode}
              </Badge>
            </div>
          </div>
        </Card>

        {/* About the Role */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
            About the Role
          </h2>
          <p className="mt-3 whitespace-pre-line text-base text-[#6d6a66]">
            {o.description || "No description provided yet."}
          </p>
        </Card>

        {/* Requirements */}
        {o.required_skills.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
              Requirements
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {o.required_skills.map((skill) => (
                <li key={skill} className="flex items-center gap-2 text-base text-[#1b1c1c]">
                  <CheckCircle2 className="h-4 w-4 text-[#735c00]" /> {skill}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div>
        <Card className="p-6">
          {alreadyApplied ? (
            <p className="flex items-center gap-2 text-sm font-semibold text-[#735c00]">
              <CheckCircle2 className="h-5 w-5" /> Application submitted!
            </p>
          ) : (
            <Button className="w-full" href={`/opportunities/${id}/apply`}>
              Apply for Internship
            </Button>
          )}

          <dl className="mt-6 flex flex-col gap-3 border-t border-[#e0d8c9]/40 pt-6 text-base">
            {o.application_deadline && (
              <div className="flex justify-between">
                <dt className="text-[#6d6a66]">Deadline</dt>
                <dd className="text-[#1b1c1c]">
                  {new Date(o.application_deadline).toLocaleDateString()}
                </dd>
              </div>
            )}
            {o.duration && (
              <div className="flex justify-between">
                <dt className="text-[#6d6a66]">Duration</dt>
                <dd className="text-[#1b1c1c]">{o.duration}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-[#6d6a66]">Stipend</dt>
              <dd className="text-[#1b1c1c]">
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
    <div className="flex flex-col gap-6">
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-[#6d6a66]">
            Opportunities &gt; {opportunity.data?.title}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
            Applicant Review
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-10 gap-2 text-sm">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" className="h-10 gap-2 text-sm">
            <ArrowUpDown className="h-4 w-4" /> Sort By: Match Score
          </Button>
        </div>
      </div>

      {/* Applicants Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                  />
                  <div>
                    <p className="text-lg font-semibold text-[#1b1c1c]">
                      {applicant.applicant_name}
                    </p>
                    <p className="text-sm text-[#6d6a66]">{applicant.institution}</p>
                  </div>
                </div>
                {applicant.match_score != null && (
                  <div className="flex flex-col items-center">
                    <DonutProgress percent={Math.round(applicant.match_score)} size={52} />
                    <span className="text-[10px] text-[#6d6a66]">Match</span>
                  </div>
                )}
              </div>

              {/* Education & Skills */}
              <div className="mt-4 flex flex-col gap-1 text-sm text-[#6d6a66]">
                {applicant.education && (
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5" /> {applicant.education}
                  </span>
                )}
                {applicant.skills.length > 0 && (
                  <span className="flex items-center gap-2">
                    <Code2 className="h-3.5 w-3.5" /> {applicant.skills.join(", ")}
                  </span>
                )}
              </div>

              {/* Status */}
              <div className="mt-3">
                <Badge
                  tone={applicant.status === "declined" ? "error" : "neutral"}
                  dot
                  className={
                    applicant.status === "declined"
                      ? "bg-[#ffdad6] text-[#ba1a1a]"
                      : "bg-[#f5f3f3] text-[#6d6a66]"
                  }
                >
                  {STATUS_LABEL[applicant.status]}
                </Badge>
              </div>

              {/* Actions */}
              <div className="mt-5 flex gap-2 border-t border-[#e0d8c9]/40 pt-4">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  href={`/interviews/propose/${applicant.id}`}
                >
                  Schedule
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Profile
                </Button>
                <button
                  onClick={() => decline(applicant.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e0d8c9] text-[#6d6a66] hover:bg-[#f5f3f3] hover:text-[#1b1c1c]"
                >
                  <X className="h-4 w-4" />
                </button>
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