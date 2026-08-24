"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { Users, Briefcase, CalendarClock, TrendingUp } from "lucide-react";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "error"> = {
  applied: "neutral",
  under_review: "warning",
  interview_scheduled: "primary" as never,
  accepted: "success",
  declined: "error",
};

function LearnerDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const mentors = useAsync(() => api.findMentors(), []);
  const applications = useAsync(() => api.myApplications(), []);

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-background">Welcome back, {user.full_name.split(" ")[0]}.</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Here is an overview of your progress today.</p>
        </div>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-headline-md text-on-background">Recommended Paths</h2>
          <Link href="/courses" className="text-label-md text-primary hover:underline">
            View All →
          </Link>
        </div>
        <div className="grid gap-md sm:grid-cols-3">
          {[
            { title: "Software Engineering 101", desc: "Master the fundamentals of modern software.", icon: TrendingUp },
            { title: "UI/UX Foundations", desc: "Understand user-centric design principles.", icon: Users },
            { title: "Product Strategy & Growth", desc: "Conceptualize, launch, and scale digital products.", icon: Briefcase },
          ].map((path) => (
            <Card key={path.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high">
                <path.icon className="h-4 w-4 text-on-surface" />
              </span>
              <p className="mt-3 text-label-md text-on-background">{path.title}</p>
              <p className="mt-1 text-label-sm text-on-surface-variant">{path.desc}</p>
              <Link href="/courses" className="mt-3 inline-block text-label-sm text-primary hover:underline">
                Start Path →
              </Link>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-headline-md text-on-background">Upcoming Mentorship</h2>
        <Card>
          {mentors.isLoading ? (
            <p className="text-body-md text-on-surface-variant">Loading mentors…</p>
          ) : mentors.data && mentors.data.length > 0 ? (
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="text-headline-md text-primary">
                  {Math.round(mentors.data[0].rating * 20)}% <span className="text-label-sm text-on-surface-variant">match</span>
                </div>
                <div>
                  <p className="text-label-md text-on-background">{mentors.data[0].user.full_name}</p>
                  <p className="text-label-sm text-on-surface-variant">
                    {mentors.data[0].title} @ {mentors.data[0].company}
                  </p>
                </div>
              </div>
              <Button href={`/mentorship/${mentors.data[0].user.id}`} variant="secondary">
                View Profile
              </Button>
            </div>
          ) : (
            <p className="text-body-md text-on-surface-variant">
              No mentor matches yet. <Link href="/mentorship" className="text-primary hover:underline">Find a mentor →</Link>
            </p>
          )}
        </Card>
      </div>

      <div>
        <h2 className="mb-3 text-headline-md text-on-background">Recent Applications</h2>
        <Card className="p-0 overflow-hidden">
          {applications.isLoading ? (
            <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
          ) : applications.data && applications.data.length > 0 ? (
            <ul className="divide-y divide-outline-variant/40">
              {applications.data.slice(0, 4).map((app) => (
                <li key={app.id} className="flex items-center justify-between p-md">
                  <div>
                    <p className="text-label-md text-on-background">{app.opportunity_title}</p>
                    <p className="text-label-sm text-on-surface-variant">{app.company_name}</p>
                  </div>
                  <Badge tone={STATUS_TONE[app.status] ?? "neutral"} dot>
                    {app.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-md text-body-md text-on-surface-variant">
              No applications yet. <Link href="/opportunities" className="text-primary hover:underline">Browse opportunities →</Link>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function CompanyDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const opportunities = useAsync(() => api.listOpportunities(true), []);
  const interviews = useAsync(() => api.upcomingInterviews(), []);

  const totalApplications = 0; // Aggregated client-side once applicant endpoints are called per-opportunity.

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">Welcome, {user.full_name}</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">Here is a summary of your current recruitment pipeline.</p>
      </div>

      <div className="grid gap-md sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-container-high">
              <Briefcase className="h-4 w-4 text-on-surface" />
            </span>
            <span className="text-label-md text-on-surface-variant">Active Internships</span>
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {opportunities.data?.length ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-surface-container-high">
              <CalendarClock className="h-4 w-4 text-on-surface" />
            </span>
            <span className="text-label-md text-on-surface-variant">Interviews Scheduled</span>
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {interviews.data?.length ?? "—"}
          </p>
        </Card>
        <Card className="bg-inverse-surface text-inverse-on-surface">
          <p className="text-label-md">Post a new role</p>
          <p className="mt-2 text-label-sm text-[#c9c7c6]">Reach thousands of vetted African youth talent.</p>
          <Button href="/opportunities/new" variant="primary" className="mt-4">
            New Application
          </Button>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-headline-md text-on-background">Active Listings</h2>
          <Link href="/opportunities" className="text-label-md text-primary hover:underline">
            View All
          </Link>
        </div>
        <Card className="overflow-hidden p-0">
          {opportunities.isLoading ? (
            <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
          ) : opportunities.data && opportunities.data.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
                <tr>
                  <th className="px-md py-3 font-normal">Role</th>
                  <th className="px-md py-3 font-normal">Work Mode</th>
                  <th className="px-md py-3 font-normal">Status</th>
                  <th className="px-md py-3 font-normal text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {opportunities.data.map((o) => (
                  <tr key={o.id}>
                    <td className="px-md py-4">
                      <p className="text-label-md text-on-background">{o.title}</p>
                      <p className="text-label-sm text-on-surface-variant">{o.location}</p>
                    </td>
                    <td className="px-md py-4 text-body-md text-on-surface capitalize">{o.work_mode}</td>
                    <td className="px-md py-4">
                      <Badge tone={o.status === "published" ? "success" : "neutral"} dot>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="px-md py-4 text-right">
                      <Link href={`/opportunities/${o.id}`} className="text-label-md text-primary hover:underline">
                        Review Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-md text-body-md text-on-surface-variant">
              You haven&apos;t posted any opportunities yet.{" "}
              <Link href="/opportunities/new" className="text-primary hover:underline">
                Post one now →
              </Link>
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

function MentorDashboard() {
  const user = useAuthStore((s) => s.user)!;
  const stats = useAsync(() => api.mentorDashboardStats(), []);
  const requests = useAsync(() => api.myMentorRequests(), []);

  async function accept(id: number) {
    await api.acceptMentorshipRequest(id);
    requests.refetch();
    stats.refetch();
  }

  async function decline(id: number) {
    await api.declineMentorshipRequest(id);
    requests.refetch();
  }

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">Welcome back, {user.full_name.split(" ")[0]}.</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">Here is a summary of your mentorship activities today.</p>
      </div>

      <div className="grid gap-md sm:grid-cols-3">
        <Card>
          <p className="text-label-sm text-on-surface-variant">TOTAL EARNINGS</p>
          <p className="mt-2 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {formatCurrency(stats.data?.total_earnings ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-label-sm text-on-surface-variant">STUDENTS MENTORED</p>
          <p className="mt-2 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.students_mentored ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-label-sm text-on-surface-variant">AVERAGE RATING</p>
          <p className="mt-2 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.average_rating?.toFixed(1) ?? "—"} <span className="text-headline-md">/ 5.0</span>
          </p>
        </Card>
      </div>

      <div className="grid gap-md lg:grid-cols-2">
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-md">
            <h2 className="text-headline-md text-on-background">Pending Requests</h2>
            <Link href="/mentorship/requests" className="text-label-md text-primary hover:underline">
              View All
            </Link>
          </div>
          {requests.isLoading ? (
            <p className="px-md pb-md text-body-md text-on-surface-variant">Loading…</p>
          ) : requests.data && requests.data.length > 0 ? (
            <ul className="divide-y divide-outline-variant/40">
              {requests.data.slice(0, 3).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-3 p-md">
                  <div>
                    <p className="text-label-md text-on-background">{r.learner_name}</p>
                    <p className="text-label-sm text-on-surface-variant">{r.session_type ?? "Session"}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => decline(r.id)}>
                      Decline
                    </Button>
                    <Button size="sm" onClick={() => accept(r.id)}>
                      Accept
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-md pb-md text-body-md text-on-surface-variant">No pending requests.</p>
          )}
        </Card>

        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-md">
            <h2 className="text-headline-md text-on-background">Today&apos;s Schedule</h2>
          </div>
          {stats.data && stats.data.todays_schedule.length > 0 ? (
            <ul className="divide-y divide-outline-variant/40">
              {stats.data.todays_schedule.map((s) => (
                <li key={s.id} className="p-md">
                  <p className="text-label-sm text-on-surface-variant">{formatTime(s.time)}</p>
                  <p className="text-label-md text-on-background">{s.title}</p>
                  <p className="text-label-sm text-on-surface-variant">with {s.with_name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-md pb-md text-body-md text-on-surface-variant">Nothing scheduled today.</p>
          )}
          <div className="p-md pt-0">
            <Button href="/mentorship/students" variant="ghost" className="w-full">
              View All Students
            </Button>
          </div>
        </Card>
      </div>

      <div className="grid gap-md sm:grid-cols-2">
        <Card>
          <p className="text-label-md text-on-background">Your Mentor Profile</p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Keep your expertise and availability up to date so learners can find the right fit.
          </p>
          <Button href="/mentorship/apply" variant="secondary" className="mt-4">
            Edit Application
          </Button>
        </Card>
        <Card>
          <p className="text-label-md text-on-background">Community Grants</p>
          <p className="mt-2 text-body-md text-on-surface-variant">
            Start or contribute to a funding group for the youth you mentor.
          </p>
          <Button href="/grants" variant="secondary" className="mt-4">
            Go to Grant Hub
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  if (!user?.role) return null;

  if (user.role === "learner") return <LearnerDashboard />;
  if (user.role === "company") return <CompanyDashboard />;
  return <MentorDashboard />;
}
