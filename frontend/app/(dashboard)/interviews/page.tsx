"use client";

import { useMemo, useState } from "react";
import { Video, Mail } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/avatar/Avatar";
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
    <Card>
      <div className="flex items-center justify-between">
        <p className="text-headline-md text-on-background">
          {viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
        <div className="flex gap-1">
          <button
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))
            }
            className="hover:bg-surface-container-low rounded-md px-2 py-1"
          >
            ‹
          </button>
          <button
            onClick={() =>
              setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))
            }
            className="hover:bg-surface-container-low rounded-md px-2 py-1"
          >
            ›
          </button>
        </div>
      </div>
      <div className="text-label-sm text-on-surface-variant mt-3 grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <span key={i}>{d}</span>
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
                "text-body-md flex h-8 items-center justify-center rounded-full",
                isToday && "bg-primary-container text-on-primary-container",
                !isToday && hasEvent && "bg-surface-container-high"
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
    <div className="gap-lg flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-background">Interview Schedule</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Manage your upcoming and pending candidate interviews.
          </p>
        </div>
      </div>

      <div className="gap-md grid lg:grid-cols-[320px_1fr]">
        <div className="gap-md flex flex-col">
          <MiniCalendar highlighted={highlighted} />

          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-headline-md text-on-background">Pending Requests</h2>
              <span className="bg-surface-container-high text-label-sm rounded-full px-2 py-0.5">
                {pending.data?.length ?? 0}
              </span>
            </div>
            {pending.isLoading ? (
              <p className="text-body-md text-on-surface-variant mt-3">Loading…</p>
            ) : pending.data && pending.data.length > 0 ? (
              <ul className="mt-3 flex flex-col gap-3">
                {pending.data.map((i) => (
                  <li key={i.id} className="border-outline-variant rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar name={i.candidate_name ?? "Candidate"} size={32} />
                        <div>
                          <p className="text-label-md text-on-background">{i.candidate_name}</p>
                          <p className="text-label-sm text-on-surface-variant">
                            {i.opportunity_title}
                          </p>
                        </div>
                      </div>
                      <Mail className="text-outline h-4 w-4" />
                    </div>
                    <p className="text-label-sm text-on-surface-variant mt-2">
                      Awaiting candidate&apos;s time selection
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-body-md text-on-surface-variant mt-3">No pending requests.</p>
            )}
          </Card>
        </div>

        <Card>
          <h2 className="text-headline-md text-on-background">Upcoming Interviews</h2>
          {interviews.isLoading ? (
            <p className="text-body-md text-on-surface-variant mt-3">Loading…</p>
          ) : interviews.data && interviews.data.length > 0 ? (
            <ul className="mt-3 flex flex-col gap-3">
              {interviews.data
                .filter((i) => i.status === "scheduled")
                .map((interview) => (
                  <li key={interview.id} className="border-outline-variant p-md rounded-md border">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={interview.candidate_name ?? "Candidate"} size={44} />
                        <div>
                          <p className="text-label-md text-on-background">
                            {interview.candidate_name}
                          </p>
                          <p className="text-body-md text-on-surface-variant">
                            {interview.opportunity_title}
                          </p>
                          {interview.scheduled_at && (
                            <p className="text-label-sm text-on-surface-variant mt-1 flex items-center gap-2">
                              {formatDate(interview.scheduled_at)} ·{" "}
                              {formatTime(interview.scheduled_at)}
                              {interview.meeting_service && ` · ${interview.meeting_service}`}
                            </p>
                          )}
                        </div>
                      </div>
                      {interview.meeting_link && (
                        <Button size="sm" variant="secondary" href={interview.meeting_link}>
                          <Video className="h-3.5 w-3.5" /> Join Meeting
                        </Button>
                      )}
                    </div>
                  </li>
                ))}
            </ul>
          ) : (
            <p className="text-body-md text-on-surface-variant mt-3">
              No interviews scheduled yet.
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
