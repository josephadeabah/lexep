"use client";

import { useParams, useRouter } from "next/navigation";
import { Award, Download } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { SharedShell } from "@/components/layout/SharedShell";

function AssessmentResultsContent() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const attemptId = Number(params.attemptId);
  const results = useAsync(() => api.getAttemptResults(attemptId), [attemptId]);

  if (results.isLoading) return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const r = results.data;
  if (!r) return <p className="text-body-md text-error">Results not found.</p>;

  return (
    <div>
      <div className="mb-lg flex items-center justify-between">
        <div>
          <p className="text-label-sm text-on-surface-variant">
            <button onClick={() => router.push("/assessments")} className="hover:text-primary">
              Back to Dashboard
            </button>{" "}
            / {r.assessment_title}
          </p>
          <h1 className="text-headline-lg text-on-background">Assessment Complete</h1>
        </div>
        <Button variant="ghost">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid gap-md lg:grid-cols-[1fr_320px]">
        <Card className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-label-sm uppercase text-on-surface-variant">Final Score</p>
            <p className="mt-1 text-display-lg text-on-background">{Math.round(r.score)}%</p>
            <p className="mt-2 text-headline-md text-on-background">{r.mastery_label}</p>
            <p className="mt-2 max-w-sm text-body-md text-on-surface-variant">
              You have demonstrated your understanding across the topics covered in this assessment.
            </p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary">Share to Profile</Button>
              <Button href="/assessments">Continue Learning</Button>
            </div>
          </div>
          <span className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full border-4 border-primary-container">
            <Award className="h-10 w-10 text-primary-container" />
          </span>
        </Card>

        <Card>
          <h2 className="text-headline-md text-on-background">Topic Breakdown</h2>
          <div className="mt-3 flex flex-col gap-3">
            {r.topic_breakdown.map((t) => (
              <div key={t.topic}>
                <div className="flex items-center justify-between text-label-sm text-on-surface-variant">
                  <span>{t.topic}</span>
                  <span>{t.percent}%</span>
                </div>
                <ProgressBar value={t.percent} className="mt-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function AssessmentResultsPage() {
  return (
    <SharedShell>
      <AssessmentResultsContent />
    </SharedShell>
  );
}
