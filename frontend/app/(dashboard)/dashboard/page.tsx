"use client";

import Link from "next/link";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";
import { formatDate, formatTime, formatCurrency } from "@/lib/utils";
import { Users, Briefcase, CalendarClock, TrendingUp, Award, BookOpen, Clock } from "lucide-react";
import { Avatar } from "@/components/ui/avatar/Avatar";

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
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
            Welcome back, {user.full_name.split(" ")[0]}.
          </h1>
          <p className="mt-1 text-base text-[#6d6a66]">
            Here is an overview of your progress today.
          </p>
        </div>
      </div>

      {/* Active Progress Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
            Active Progress
          </h2>
          <Link href="/courses" className="text-sm font-semibold text-[#735c00] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Course 1 - In Progress */}
          <Card className="flex flex-col overflow-hidden">
            <div className="relative h-40 bg-[#f5f3f3]">
              <img 
                src="/images/mentorship.jpg" 
                alt="Advanced Structural Analysis" 
                className="h-full w-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-white text-[#1b1c1c]">
                Architecture
              </Badge>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
                Advanced Structural Analysis & Design
              </h3>
              <p className="mt-2 text-sm text-[#6d6a66]">
                Module 4: Load Bearing Systems
              </p>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-[#6d6a66]">
                  <span>65% Complete</span>
                  <span>2h remaining</span>
                </div>
                <ProgressBar value={65} className="mt-2" />
              </div>

              <Button variant="primary" className="mt-4 w-full">
                Continue Learning
              </Button>
            </div>
          </Card>

          {/* Course 2 - 30% */}
          <Card className="flex flex-col overflow-hidden">
            <div className="relative h-40 bg-[#f5f3f3]">
              <img 
                src="/images/cover-texture.jpg" 
                alt="Sustainable Building Materials" 
                className="h-full w-full object-cover"
              />
              <Badge className="absolute top-4 left-4 bg-white text-[#1b1c1c]">
                Project Management
              </Badge>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
                Sustainable Building Materials
              </h3>
              <p className="mt-2 text-sm text-[#6d6a66]">
                Module 2: Alternative Composites
              </p>
              
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-[#6d6a66]">
                  <span>30% Complete</span>
                  <span>4h remaining</span>
                </div>
                <ProgressBar value={30} className="mt-2" />
              </div>

              <Button variant="outline" className="mt-4 w-full">
                Continue Learning
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recommended Paths */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
            Recommended Paths
          </h2>
          <Link href="/courses" className="text-sm font-semibold text-[#735c00] hover:underline">
            View All →
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "BIM Fundamentals",
              desc: "Master the core concepts of Building Information Modeling...",
              icon: Award,
            },
            {
              title: "Urban Planning Pro",
              desc: "Design sustainable and scalable city layouts focusing on future...",
              icon: Briefcase,
            },
            {
              title: "Leadership in Design",
              desc: "Develop soft skills necessary to lead major architectural firms...",
              icon: Users,
            },
          ].map((path) => (
            <Card key={path.title}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3f3]">
                <path.icon className="h-4 w-4 text-[#735c00]" />
              </span>
              <p className="mt-3 text-base font-semibold text-[#1b1c1c]">{path.title}</p>
              <p className="mt-1 text-sm text-[#6d6a66]">{path.desc}</p>
              <Link
                href="/courses"
                className="mt-3 inline-block text-sm font-semibold text-[#735c00] hover:underline"
              >
                START PATH →
              </Link>
            </Card>
          ))}
        </div>
      </div>

      {/* Upcoming Mentorship */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
          Upcoming Mentorship
        </h2>
        <Card className="p-6">
          {mentors.isLoading ? (
            <p className="text-base text-[#6d6a66]">Loading mentors…</p>
          ) : mentors.data && mentors.data.length > 0 ? (
            <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
              {/* Match Score */}
              <div className="flex items-center gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-[#d4af37]">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk']">
                      {Math.round(mentors.data[0].rating * 20)}%
                    </p>
                    <p className="text-[10px] text-[#6d6a66]">MATCH</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Avatar 
                    name={mentors.data[0].user.full_name} 
                    src={mentors.data[0].user.avatar_url} 
                    size={48} 
                  />
                  <div>
                    <p className="text-lg font-semibold text-[#1b1c1c]">
                      Dr. {mentors.data[0].user.full_name}
                    </p>
                    <p className="text-sm text-[#6d6a66]">
                      {mentors.data[0].title} @ {mentors.data[0].company}
                    </p>
                    <div className="mt-1 flex items-center gap-2 text-sm text-[#6d6a66]">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Tomorrow, 10:00 AM (GMT)
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Button href={`/mentorship/${mentors.data[0].user.id}`} variant="primary" className="w-full">
                  Join Session
                </Button>
                <Button variant="outline" className="w-full">
                  Reschedule
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-base text-[#6d6a66]">
              No mentor matches yet.{" "}
              <Link href="/mentorship" className="text-[#735c00] hover:underline">
                Find a mentor →
              </Link>
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

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
          Welcome, {user.full_name}
        </h1>
        <p className="mt-1 text-base text-[#6d6a66]">
          Here is a summary of your current recruitment pipeline.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f5f3f3]">
              <Briefcase className="h-4 w-4 text-[#735c00]" />
            </span>
            <span className="text-sm text-[#6d6a66]">Active Internships</span>
          </div>
          <p className="mt-3 text-5xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk']">
            {opportunities.data?.length ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#f5f3f3]">
              <CalendarClock className="h-4 w-4 text-[#735c00]" />
            </span>
            <span className="text-sm text-[#6d6a66]">Interviews Scheduled</span>
          </div>
          <p className="mt-3 text-5xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk']">
            {interviews.data?.length ?? "—"}
          </p>
        </Card>
        <Card className="bg-[#1b1c1c] text-white">
          <p className="text-sm font-semibold">Post a new role</p>
          <p className="mt-2 text-sm text-[#c9c7c6]">
            Reach thousands of vetted African youth talent.
          </p>
          <Button href="/opportunities/new" variant="primary" className="mt-4 w-full">
            New Application
          </Button>
        </Card>
      </div>

      {/* Active Listings */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
            Active Listings
          </h2>
          <Link href="/opportunities" className="text-sm font-semibold text-[#735c00] hover:underline">
            View All
          </Link>
        </div>
        <Card className="overflow-hidden p-0">
          {opportunities.isLoading ? (
            <p className="p-6 text-base text-[#6d6a66]">Loading…</p>
          ) : opportunities.data && opportunities.data.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-[#f5f3f3] text-sm text-[#6d6a66]">
                <tr>
                  <th className="px-6 py-3 font-normal">Role</th>
                  <th className="px-6 py-3 font-normal">Work Mode</th>
                  <th className="px-6 py-3 font-normal">Status</th>
                  <th className="px-6 py-3 text-right font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e0d8c9]">
                {opportunities.data.map((o) => (
                  <tr key={o.id}>
                    <td className="px-6 py-4">
                      <p className="text-base font-semibold text-[#1b1c1c]">{o.title}</p>
                      <p className="text-sm text-[#6d6a66]">{o.location}</p>
                    </td>
                    <td className="px-6 py-4 text-base capitalize text-[#1b1c1c]">
                      {o.work_mode}
                    </td>
                    <td className="px-6 py-4">
                      <Badge tone={o.status === "published" ? "success" : "neutral"} dot>
                        {o.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/opportunities/${o.id}`}
                        className="text-sm font-semibold text-[#735c00] hover:underline"
                      >
                        Review Applicants
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-base text-[#6d6a66]">
              You haven&apos;t posted any opportunities yet.{" "}
              <Link href="/opportunities/new" className="text-[#735c00] hover:underline">
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
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
          Welcome back, {user.full_name.split(" ")[0]}.
        </h1>
        <p className="mt-1 text-base text-[#6d6a66]">
          Here is a summary of your mentorship activities today.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-[#6d6a66]">TOTAL EARNINGS</p>
          <p className="mt-2 text-5xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk']">
            {formatCurrency(stats.data?.total_earnings ?? 0)}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[#6d6a66]">STUDENTS MENTORED</p>
          <p className="mt-2 text-5xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk']">
            {stats.data?.students_mentored ?? 0}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-[#6d6a66]">AVERAGE RATING</p>
          <p className="mt-2 text-5xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk']">
            {stats.data?.average_rating?.toFixed(1) ?? "—"}{" "}
            <span className="text-2xl">/ 5.0</span>
          </p>
        </Card>
      </div>

      {/* Pending Requests & Schedule */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="overflow-hidden p-0">
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk']">
              Pending Requests
            </h2>
            <Link href="/mentorship/requests" className="text-sm font-semibold text-[#735c00] hover:underline">
              View All
            </Link>
          </div>
          {requests.isLoading ? (
            <p className="px-6 pb-6 text-base text-[#6d6a66]">Loading…</p>
          ) : requests.data && requests.data.length > 0 ? (
            <ul className="divide-y divide-[#e0d8c9]">
              {requests.data.slice(0, 3).map((r) => (
                <li key={r.id} className="p-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-base font-semibold text-[#1b1c1c]">{r.learner_name}</p>
                    <p className="text-sm text-[#6d6a66]">
                      {r.session_type ?? "Session"}
                    </p>
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
            <p className="px-6 pb-6 text-base text-[#6d6a66]">No pending requests.</p>
          )}
        </Card>

        <Card className="overflow-hidden p-0">
          <div className="p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk']">
              Today&apos;s Schedule
            </h2>
          </div>
          {stats.data && stats.data.todays_schedule.length > 0 ? (
            <ul className="divide-y divide-[#e0d8c9]">
              {stats.data.todays_schedule.map((s) => (
                <li key={s.id} className="p-6">
                  <p className="text-sm text-[#6d6a66]">{formatTime(s.time)}</p>
                  <p className="text-base font-semibold text-[#1b1c1c]">{s.title}</p>
                  <p className="text-sm text-[#6d6a66]">with {s.with_name}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 pb-6 text-base text-[#6d6a66]">
              Nothing scheduled today.
            </p>
          )}
          <div className="p-6 pt-0">
            <Button href="/mentorship/students" variant="ghost" className="w-full">
              View All Students
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-base font-semibold text-[#1b1c1c]">Your Mentor Profile</p>
          <p className="mt-2 text-sm text-[#6d6a66]">
            Keep your expertise and availability up to date so learners can find the right fit.
          </p>
          <Button href="/mentorship/apply" variant="secondary" className="mt-4">
            Edit Application
          </Button>
        </Card>
        <Card>
          <p className="text-base font-semibold text-[#1b1c1c]">Community Grants</p>
          <p className="mt-2 text-sm text-[#6d6a66]">
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