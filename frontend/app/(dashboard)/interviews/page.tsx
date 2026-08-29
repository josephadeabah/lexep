"use client";

import { useMemo, useState } from "react";
import { Video, Mail, CalendarClock, Link2 } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Badge } from "@/components/ui/badge/Badge";
import { formatDate, formatTime, cn } from "@/lib/utils";

function MiniCalendar({ highlighted }: { highlighted: Date[] }) {
  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const days = useMemo(() => {
    const start = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
    const startWeekday = start.getDay();
    const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();
    const cells: (number | null)[] = Array(startWeekday).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [viewDate]);

  const highlightedDates = new Set(highlighted.map((d) => d.toDateString()));

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <p className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
          {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
            }
            className="hover:bg-[#f5f3f3] rounded-md px-2 py-1 text-[#6d6a66]"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
            }
            className="hover:bg-[#f5f3f3] rounded-md px-2 py-1 text-[#6d6a66]"
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i} className="text-xs font-semibold text-[#6d6a66]">
            {d}
          </span>
        ))}
        {days.map((day, i) => {
          if (!day) return <span key={i} />;
          const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const isToday = date.toDateString() === today.toDateString();
          const hasEvent = highlightedDates.has(date.toDateString());
          return (
            <span
              key={i}
              className={cn(
                "flex h-9 w-full items-center justify-center rounded-full text-sm font-medium",
                isToday
                  ? "bg-[#d4af37] text-[#1b1c1c]"
                  : hasEvent
                    ? "bg-[#f7edc9] text-[#735c00]"
                    : "text-[#1b1c1c]"
              )}
            >
              {day}
            </span>
          );
        })}
      </div>
    </Card>
  );
}

export default function InterviewsPage() {
  const interviews = useAsync(() => api.upcomingInterviews(), []);
  const pending = useAsync(() => api.pendingInterviews(), []);

  const highlighted = (interviews.data ?? [])
    .map((i) => (i.scheduled_at ? new Date(i.scheduled_at) : null))
    .filter((d): d is Date => !!d);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
            Interview Schedule
          </h1>
          <p className="mt-2 text-base text-[#6d6a66]">
            Manage your upcoming and pending candidate interviews.
          </p>
        </div>

        {/* Integration Badges */}
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-[#f5f3f3] text-[#6d6a66]">
            <Link2 className="mr-1 h-3 w-3" /> Google Meet Linked
          </Badge>
          <Badge className="bg-[#f5f3f3] text-[#6d6a66]">
            <Link2 className="mr-1 h-3 w-3" /> Zoom Linked
          </Badge>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Mini Calendar */}
          <MiniCalendar highlighted={highlighted} />

          {/* Pending Requests */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
                Pending Requests
              </h2>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f5f3f3] text-sm font-semibold text-[#6d6a66]">
                {pending.data?.length ?? 0}
              </span>
            </div>

            {pending.isLoading ? (
              <p className="mt-4 text-base text-[#6d6a66]">Loading…</p>
            ) : pending.data && pending.data.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-3">
                {pending.data.map((i) => (
                  <li key={i.id} className="rounded-lg border border-[#e0d8c9] p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={i.candidate_name ?? "Candidate"}
                          size={40}
                          className="rounded-full"
                        />
                        <div>
                          <p className="text-sm font-semibold text-[#1b1c1c]">
                            {i.candidate_name}
                          </p>
                          <p className="text-xs text-[#6d6a66]">
                            {i.opportunity_title}
                          </p>
                        </div>
                      </div>
                      <Mail className="h-4 w-4 text-[#6d6a66]" />
                    </div>
                    <p className="mt-2 text-xs text-[#6d6a66]">
                      Requested 2 days ago
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-base text-[#6d6a66]">No pending requests.</p>
            )}
          </Card>
        </div>

        {/* Upcoming Interviews */}
        <Card className="p-6">
          <div className="flex items-center justify-between border-b border-[#e0d8c9]/40 pb-4">
            <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
              Upcoming Interviews
            </h2>
            <button className="text-sm font-semibold text-[#735c00] hover:underline">
              View All →
            </button>
          </div>

          {interviews.isLoading ? (
            <p className="mt-4 text-base text-[#6d6a66]">Loading…</p>
          ) : interviews.data && interviews.data.length > 0 ? (
            <ul className="mt-4 flex flex-col gap-4">
              {interviews.data
                .filter((i) => i.status === "scheduled")
                .map((interview) => (
                  <li
                    key={interview.id}
                    className="flex flex-col gap-4 rounded-lg border border-[#e0d8c9] p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    {/* Interview Info */}
                    <div className="flex items-start gap-4">
                      <Avatar
                        name={interview.candidate_name ?? "Candidate"}
                        size={48}
                        className="rounded-full"
                      />
                      <div>
                        <p className="text-base font-semibold text-[#1b1c1c]">
                          {interview.candidate_name}
                        </p>
                        <p className="text-sm text-[#6d6a66]">
                          {interview.opportunity_title}
                        </p>
                        <div className="mt-2 flex items-center gap-3 text-sm text-[#6d6a66]">
                          <span className="flex items-center gap-1">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {interview.scheduled_at &&
                              `${formatDate(interview.scheduled_at)} · ${formatTime(interview.scheduled_at)}`}
                          </span>
                          {interview.meeting_service && (
                            <span className="flex items-center gap-1">
                              <Video className="h-3.5 w-3.5" />
                              {interview.meeting_service}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 sm:w-[180px]">
                      {interview.meeting_link ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          href={interview.meeting_link}
                          className="w-full bg-[#1b1c1c] font-semibold text-white hover:bg-[#2a2b2b]"
                        >
                          <Video className="h-3.5 w-3.5" /> Join Meeting
                        </Button>
                      ) : (
                        <span className="text-center text-sm text-[#6d6a66]">
                          Starting later
                        </span>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-[#e0d8c9]"
                      >
                        View Profile
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="mt-4 text-base text-[#6d6a66]">
              No interviews scheduled yet.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}