"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X } from "lucide-react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { RoleGuard } from "@/components/layout/RoleGuard";

/** Default suggestion: two business days from now at 10:00 AM local time,
 * formatted for a <input type="datetime-local"> value. */
function defaultDateTimeLocal(): string {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  d.setHours(10, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ScheduleInterviewContent() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();
  const applicationId = Number(params.applicationId);

  const [interviewType, setInterviewType] = useState("Technical Assessment");
  const [dateTime, setDateTime] = useState(defaultDateTimeLocal());
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSend() {
    if (!dateTime) return;
    setIsSubmitting(true);
    try {
      // Direct scheduling — the company picks one time and the candidate is
      // notified immediately with a confirmed date, rather than choosing
      // among several proposed slots (see routers/interviews.py:schedule_interview).
      await api.scheduleInterview({
        application_id: applicationId,
        scheduled_at: new Date(dateTime).toISOString(),
        duration_minutes: Number(durationMinutes || 45),
        interview_type: interviewType,
        message_to_candidate: message || undefined,
      });
      router.push("/interviews");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-gutter">
      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-surface-container-lowest shadow-level2">
        <div className="flex items-center justify-between border-b border-outline-variant/40 p-md">
          <div>
            <h1 className="text-headline-md text-on-background">Schedule Interview</h1>
            <p className="text-body-md text-on-surface-variant">Pick a time and confirm — the candidate is notified right away.</p>
          </div>
          <button onClick={() => router.back()} className="text-on-surface-variant hover:text-on-background">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-md">
          <div className="flex flex-col gap-md">
            <Select label="Interview Type" value={interviewType} onChange={(e) => setInterviewType(e.target.value)}>
              <option>Technical Assessment</option>
              <option>Portfolio Review</option>
              <option>Culture Fit</option>
              <option>Final Round</option>
            </Select>

            <div className="grid gap-md sm:grid-cols-2">
              <Input
                label="Date & Time"
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
              />
              <Input
                label="Duration (mins)"
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
              />
            </div>

            <Textarea
              label="Message to Candidate"
              placeholder="Add a personal note…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-label-sm text-on-surface-variant">
              The candidate will get an in-app notification with this date, time, and meeting details — no separate
              time-selection step needed.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-outline-variant/40 p-md">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={!dateTime || isSubmitting}>
            {isSubmitting ? "Scheduling…" : "Confirm & Notify Candidate"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ScheduleInterviewPage() {
  return (
    <RoleGuard allow={["company"]}>
      <ScheduleInterviewContent />
    </RoleGuard>
  );
}
