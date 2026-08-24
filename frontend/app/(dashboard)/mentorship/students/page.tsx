"use client";

import { Users, CalendarClock, AlertCircle, MessageSquare, Folder } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatTime } from "@/lib/utils";

export default function MentorStudentsPage() {
  const students = useAsync(() => api.myStudents(), []);

  const pendingFeedback = (students.data ?? []).length; // placeholder metric — see note below

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">My Students</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Track progress, manage sessions, and review submissions for your active mentees.
        </p>
      </div>

      <div className="grid gap-md sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <Users className="h-4 w-4 text-primary" /> ACTIVE STUDENTS
          </div>
          <p
            className="mt-3 text-display-lg text-on-background"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {students.data?.length ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <CalendarClock className="h-4 w-4 text-primary" /> SESSIONS THIS MONTH
          </div>
          <p
            className="mt-3 text-display-lg text-on-background"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {students.data?.filter((s) => s.confirmed_time).length ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <AlertCircle className="h-4 w-4 text-primary" /> PENDING FEEDBACK
          </div>
          <p
            className="mt-3 text-display-lg text-on-background"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            0
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-outline-variant/40 p-md">
          <h2 className="text-headline-md text-on-background">Active Mentees</h2>
        </div>
        {students.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
        ) : students.data && students.data.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
              <tr>
                <th className="px-md py-3 font-normal">Student</th>
                <th className="px-md py-3 font-normal">Session Type</th>
                <th className="px-md py-3 font-normal">Next Session</th>
                <th className="px-md py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {students.data.map((s) => (
                <tr key={s.id}>
                  <td className="px-md py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={s.learner_name ?? "Student"} size={36} />
                      <p className="text-label-md text-on-background">{s.learner_name}</p>
                    </div>
                  </td>
                  <td className="px-md py-4 text-body-md text-on-surface">
                    {s.session_type ?? "—"}
                  </td>
                  <td className="px-md py-4 text-body-md text-on-surface">
                    {s.confirmed_time
                      ? `${formatDate(s.confirmed_time)}, ${formatTime(s.confirmed_time)}`
                      : "Not scheduled"}
                  </td>
                  <td className="px-md py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-md border border-outline-variant p-2 hover:bg-surface-container-low">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                      <button className="rounded-md border border-outline-variant p-2 hover:bg-surface-container-low">
                        <Folder className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-md text-body-md text-on-surface-variant">No active mentees yet.</p>
        )}
      </Card>
    </div>
  );
}
