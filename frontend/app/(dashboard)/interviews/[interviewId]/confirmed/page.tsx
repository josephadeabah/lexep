"use client";

import { useParams, useRouter } from "next/navigation";
import { CheckCircle2, Calendar, Clock, Video, ArrowLeft } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatTime } from "@/lib/utils";

export default function InterviewConfirmedPage() {
  const params = useParams<{ interviewId: string }>();
  const router = useRouter();
  const interviewId = Number(params.interviewId);
  const interview = useAsync(() => api.getInterview(interviewId), [interviewId]);

  if (interview.isLoading) return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const i = interview.data;
  if (!i || !i.scheduled_at) return <p className="text-body-md text-error">Interview not found.</p>;

  return (
    <div className="mx-auto max-w-xl text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-fixed">
        <CheckCircle2 className="h-8 w-8 text-on-primary-fixed-variant" />
      </span>
      <h1 className="mt-6 text-headline-lg text-on-background">Interview Confirmed!</h1>
      <p className="mt-2 text-body-md text-on-surface-variant">
        Your interview {i.candidate_name ? `with ${i.candidate_name} ` : ""}has been successfully scheduled.
      </p>

      <Card className="mt-lg text-left">
        <div className="grid grid-cols-2 gap-md">
          <div>
            <p className="flex items-center gap-2 text-label-sm text-on-surface-variant">
              <Calendar className="h-4 w-4" /> DATE &amp; TIME
            </p>
            <p className="mt-1 text-body-md text-on-background">
              {formatDate(i.scheduled_at)} · {formatTime(i.scheduled_at)}
            </p>
          </div>
          <div>
            <p className="flex items-center gap-2 text-label-sm text-on-surface-variant">
              <Clock className="h-4 w-4" /> DURATION
            </p>
            <p className="mt-1 text-body-md text-on-background">{i.duration_minutes} Minutes</p>
          </div>
        </div>

        {i.candidate_name && (
          <div className="mt-md border-t border-outline-variant/40 pt-md">
            <p className="text-label-sm text-on-surface-variant">PARTICIPANTS</p>
            <div className="mt-2 flex items-center gap-2">
              <Avatar name={i.candidate_name} size={32} />
              <span className="text-body-md text-on-surface">{i.candidate_name}</span>
            </div>
          </div>
        )}

        {i.meeting_link && (
          <Button href={i.meeting_link} variant="secondary" className="mt-md w-full">
            <Video className="h-4 w-4" /> Join {i.meeting_service ?? "Meeting"}
          </Button>
        )}
        <p className="mt-2 text-label-sm text-on-surface-variant">The link will activate 5 minutes before the scheduled time.</p>
      </Card>

      <Button variant="ghost" className="mt-lg" onClick={() => router.push("/dashboard")}>
        <ArrowLeft className="h-4 w-4" /> Back to Dashboard
      </Button>
    </div>
  );
}
