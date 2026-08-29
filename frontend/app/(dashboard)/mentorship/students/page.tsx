"use client";

import { Users, CalendarClock, AlertCircle, MessageSquare, Folder, Bell, CheckCircle2 } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";
import { formatDate, formatTime } from "@/lib/utils";

export default function MentorStudentsPage() {
  const students = useAsync(() => api.myStudents(), []);

  const pendingFeedback = (students.data ?? []).length;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
          My Students
        </h1>
        <p className="mt-2 text-base text-[#6d6a66]">
          Track progress, manage sessions, and review submissions for your active mentees.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7edc9]">
              <Users className="h-5 w-5 text-[#735c00]" />
            </span>
            <span className="text-sm font-semibold text-[#6d6a66]">ACTIVE STUDENTS</span>
          </div>
          <p className="mt-3 font-['Hanken_Grotesk'] text-5xl font-bold text-[#1b1c1c]">
            {students.data?.length ?? "—"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3f3]">
              <CalendarClock className="h-5 w-5 text-[#735c00]" />
            </span>
            <span className="text-sm font-semibold text-[#6d6a66]">SESSIONS THIS MONTH</span>
          </div>
          <p className="mt-3 font-['Hanken_Grotesk'] text-5xl font-bold text-[#1b1c1c]">
            {students.data?.filter((s) => s.confirmed_time).length ?? "—"}
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f7edc9]">
              <AlertCircle className="h-5 w-5 text-[#735c00]" />
            </span>
            <span className="text-sm font-semibold text-[#6d6a66]">PENDING FEEDBACK</span>
          </div>
          <p className="mt-3 font-['Hanken_Grotesk'] text-5xl font-bold text-[#1b1c1c]">4</p>
        </Card>
      </div>

      {/* Active Mentees & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Active Mentees Table */}
        <Card className="overflow-hidden p-0">
          <div className="flex items-center justify-between border-b border-[#e0d8c9]/40 p-6">
            <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c] sm:text-2xl">
              Active Mentees
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-[#e0d8c9]">
                Filter
              </Button>
              <Button variant="outline" size="sm" className="border-[#e0d8c9]">
                Sort
              </Button>
            </div>
          </div>

          {students.isLoading ? (
            <p className="p-6 text-base text-[#6d6a66]">Loading…</p>
          ) : students.data && students.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-left">
                <thead className="bg-[#f5f3f3] text-xs font-semibold uppercase tracking-wider text-[#6d6a66]">
                  <tr>
                    <th className="px-6 py-3 font-normal">Student</th>
                    <th className="px-6 py-3 font-normal">Package & Progress</th>
                    <th className="px-6 py-3 font-normal">Next Session</th>
                    <th className="px-6 py-3 text-right font-normal">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e0d8c9]/40">
                  {students.data.slice(0, 2).map((s, index) => (
                    <tr key={s.id}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={s.learner_name ?? "Student"}
                            size={48}
                            className="rounded-full"
                          />
                          <div>
                            <p className="text-base font-semibold text-[#1b1c1c]">
                              {s.learner_name}
                            </p>
                            <p className="text-sm text-[#6d6a66]">Year 4, B.Arch</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-semibold text-[#1b1c1c]">
                            {s.session_type ?? "Portfolio Review"}
                          </p>
                          <div className="mt-2">
                            <div className="flex items-center gap-2">
                              <ProgressBar value={index === 0 ? 67 : 40} className="w-24" />
                              <span className="text-xs text-[#6d6a66]">
                                {index === 0 ? "2/3 Done" : "Waiting for Feedback"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-sm text-[#6d6a66]">
                          <CalendarClock className="h-4 w-4" />
                          {s.confirmed_time
                            ? `${formatDate(s.confirmed_time)}, ${formatTime(s.confirmed_time)}`
                            : "Not scheduled"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          <button className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e0d8c9] hover:bg-[#f5f3f3]">
                            <MessageSquare className="h-4 w-4 text-[#6d6a66]" />
                          </button>
                          <button className="flex h-9 w-9 items-center justify-center rounded-md border border-[#e0d8c9] hover:bg-[#f5f3f3]">
                            <Folder className="h-4 w-4 text-[#6d6a66]" />
                          </button>
                          {index === 1 && (
                            <Button size="sm" className="bg-[#1b1c1c] font-semibold">
                              Review Now
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="p-6 text-base text-[#6d6a66]">No active mentees yet.</p>
          )}
        </Card>

        {/* Recent Activity */}
        <Card className="h-fit p-6">
          <h2 className="flex items-center gap-2 font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
            <Bell className="h-5 w-5 text-[#d4af37]" /> Recent Activity
          </h2>

          <div className="mt-4 space-y-6">
            {/* Activity Item 1 */}
            <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#d4af37]">
              <p className="text-sm font-semibold text-[#1b1c1c]">Portfolio Submitted</p>
              <p className="mt-1 text-sm text-[#6d6a66]">
                Kwame Mensah uploaded 'Final Year Project V2' for review.
              </p>
              <p className="mt-2 text-xs text-[#6d6a66]">2 hours ago</p>
            </div>

            {/* Activity Item 2 */}
            <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#e0d8c9]">
              <p className="text-sm font-semibold text-[#1b1c1c]">Session Completed</p>
              <p className="mt-1 text-sm text-[#6d6a66]">
                Intro to Firm Culture with Amara Okafor.
              </p>
              <p className="mt-2 text-xs text-[#6d6a66]">Yesterday</p>
            </div>

            {/* Activity Item 3 */}
            <div className="relative pl-6 before:absolute before:left-0 before:top-1.5 before:h-2 before:w-2 before:rounded-full before:bg-[#e0d8c9]">
              <p className="text-sm font-semibold text-[#1b1c1c]">New Message</p>
              <p className="mt-1 text-sm text-[#6d6a66]">
                "Thank you for the notes on my resume!" - Chioma E.
              </p>
              <p className="mt-2 text-xs text-[#6d6a66]">2 days ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}