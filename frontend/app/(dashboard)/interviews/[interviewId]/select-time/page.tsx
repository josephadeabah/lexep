"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Building2, Clock, Video, User as UserIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SelectInterviewTimePage() {
  const params = useParams<{ interviewId: string }>();
  const router = useRouter();
  const interviewId = Number(params.interviewId);

  const interview = useAsync(() => api.getInterview(interviewId), [interviewId]);
  const [selected, setSelected] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    if (!selected) return;
    setIsSubmitting(true);
    try {
      await api.selectInterviewTime(interviewId, selected);
      router.push(`/interviews/${interviewId}/confirmed`);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (interview.isLoading) return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const i = interview.data;
  if (!i) return <p className="text-body-md text-error">Interview not found.</p>;

  const byDay = new Map<string, string[]>();
  i.proposed_times.forEach((t) => {
    const day = new Date(t).toDateString();
    byDay.set(day, [...(byDay.get(day) ?? []), t]);
  });

  return (
    <div className="gap-md grid lg:grid-cols-[320px_1fr]">
      <Card className="h-fit">
        <span className="bg-surface-container-high flex h-12 w-12 items-center justify-center rounded-md">
          <Building2 className="text-on-surface h-5 w-5" />
        </span>
        <h1 className="text-headline-md text-on-background mt-4">Schedule Your Interview</h1>
        <p className="text-body-md text-on-surface-variant mt-2">
          Select a time slot from the options below that works best for you.
        </p>
        <div className="mt-md border-outline-variant/40 pt-md text-body-md text-on-surface flex flex-col gap-2 border-t">
          <span className="flex items-center gap-2">
            <Clock className="text-on-surface-variant h-4 w-4" /> {i.duration_minutes} Minutes
          </span>
          {i.meeting_service && (
            <span className="flex items-center gap-2">
              <Video className="text-on-surface-variant h-4 w-4" /> {i.meeting_service}
            </span>
          )}
          {i.opportunity_title && (
            <span className="flex items-center gap-2">
              <UserIcon className="text-on-surface-variant h-4 w-4" /> {i.opportunity_title}
            </span>
          )}
        </div>
      </Card>

      <Card>
        {Array.from(byDay.entries()).map(([day, times]) => (
          <div key={day} className="mb-md last:mb-0">
            <p className="text-label-md text-on-background mb-2">
              Available slots for{" "}
              {new Date(day).toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {times.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelected(t)}
                  className={cn(
                    "text-label-md rounded-md border p-4 transition",
                    selected === t
                      ? "border-primary-container bg-primary-fixed text-on-primary-fixed-variant"
                      : "border-outline-variant text-on-surface hover:bg-surface-container-low"
                  )}
                >
                  {new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-md border-outline-variant/40 pt-md flex items-center justify-between border-t">
          <div>
            <p className="text-label-sm text-on-surface-variant">Selected time:</p>
            <p className="text-body-md text-on-background">
              {selected
                ? new Date(selected).toLocaleString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })
                : "None yet"}
            </p>
          </div>
          <Button onClick={handleConfirm} disabled={!selected || isSubmitting}>
            {isSubmitting ? "Confirming…" : "Confirm Selection →"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
