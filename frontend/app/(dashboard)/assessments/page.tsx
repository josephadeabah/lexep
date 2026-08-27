"use client";

import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";

export default function AssessmentHubPage() {
  const router = useRouter();
  const assessments = useAsync(() => api.listAssessments(), []);
  const attempts = useAsync(() => api.myAttempts(), []);

  const featured = (assessments.data ?? []).find((a) => a.featured) ?? assessments.data?.[0];
  const inProgress = (attempts.data ?? []).filter((a) => a.status === "in_progress");

  async function start(assessmentId: number) {
    const progress = await api.startAttempt(assessmentId);
    router.push(`/assessments/${assessmentId}/take?attempt=${progress.attempt_id}`);
  }

  return (
    <div className="gap-lg flex flex-col">
      <div>
        <h1 className="text-headline-lg text-on-background">Skill Assessment Hub</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Validate your expertise across domains and unlock advanced learning paths.
        </p>
      </div>

      {featured && (
        <Card className="gap-md grid sm:grid-cols-2">
          <div>
            <div className="flex gap-2">
              <Badge tone="primary">
                <Star className="mr-1 h-3 w-3" /> Featured
              </Badge>
              {featured.level && <Badge>{featured.level}</Badge>}
            </div>
            <h2 className="text-headline-lg text-on-background mt-3">{featured.title}</h2>
            <p className="text-body-md text-on-surface-variant mt-2">{featured.description}</p>
            <p className="text-label-sm text-on-surface-variant mt-2">
              {featured.question_count} questions · {featured.duration_minutes} minutes
            </p>
            <Button className="mt-4" onClick={() => start(featured.id)}>
              Start Assessment
            </Button>
          </div>
          <div className="bg-surface-container-high hidden items-center justify-center rounded-lg sm:flex">
            <span className="text-label-sm text-on-surface-variant">{featured.category}</span>
          </div>
        </Card>
      )}

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-headline-md text-on-background">In Progress</h2>
        </div>
        {attempts.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading…</p>
        ) : inProgress.length > 0 ? (
          <div className="gap-md grid sm:grid-cols-2">
            {inProgress.map((attempt) => {
              const percent = attempt.total_questions
                ? Math.round((attempt.current_index / attempt.total_questions) * 100)
                : 0;
              return (
                <Card key={attempt.id}>
                  <p className="text-label-md text-on-background">{attempt.assessment_title}</p>
                  <div className="text-label-sm text-on-surface-variant mt-3 flex items-center justify-between">
                    <span>{percent}% Completed</span>
                    <span>
                      {attempt.current_index}/{attempt.total_questions} questions
                    </span>
                  </div>
                  <ProgressBar value={percent} className="mt-2" />
                  <Button
                    variant="secondary"
                    className="mt-4 w-full"
                    onClick={() =>
                      router.push(
                        `/assessments/${attempt.assessment_id}/take?attempt=${attempt.id}`
                      )
                    }
                  >
                    Continue
                  </Button>
                </Card>
              );
            })}
          </div>
        ) : (
          <p className="text-body-md text-on-surface-variant">No assessments in progress.</p>
        )}
      </div>

      <div>
        <h2 className="text-headline-md text-on-background mb-3">All Assessments</h2>
        <div className="gap-md grid sm:grid-cols-2 lg:grid-cols-3">
          {(assessments.data ?? []).map((assessment) => (
            <Card key={assessment.id}>
              <div className="mb-2 flex items-center gap-2">
                {assessment.level && <Badge>{assessment.level}</Badge>}
                <span className="text-label-sm text-on-surface-variant">{assessment.category}</span>
              </div>
              <p className="text-headline-md text-on-background">{assessment.title}</p>
              <p className="text-body-md text-on-surface-variant mt-2">{assessment.description}</p>
              <p className="text-label-sm text-on-surface-variant mt-2">
                {assessment.question_count} questions · {assessment.duration_minutes} min
              </p>
              <Button variant="ghost" className="mt-4 w-full" onClick={() => start(assessment.id)}>
                Start
              </Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
