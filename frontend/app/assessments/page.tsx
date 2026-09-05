"use client";

import { useRouter } from "next/navigation";
import { Star, Plus, Trophy } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { SharedShell } from "@/components/layout/SharedShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useAuthStore } from "@/lib/auth-store";

function LearnerAssessmentHub() {
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
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">Skill Assessment Hub</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Validate your expertise across domains and unlock advanced learning paths.
        </p>
      </div>

      {featured && (
        <Card className="grid gap-md sm:grid-cols-2">
          <div>
            <div className="flex gap-2">
              <Badge tone="primary">
                <Star className="mr-1 h-3 w-3" /> Featured
              </Badge>
              {featured.level && <Badge>{featured.level}</Badge>}
            </div>
            <h2 className="mt-3 text-headline-lg text-on-background">{featured.title}</h2>
            <p className="mt-2 text-body-md text-on-surface-variant">{featured.description}</p>
            <p className="mt-2 text-label-sm text-on-surface-variant">
              {featured.question_count} questions · {featured.duration_minutes} minutes
            </p>
            <Button className="mt-4" onClick={() => start(featured.id)}>
              Start Assessment
            </Button>
          </div>
          <div className="hidden items-center justify-center rounded-lg bg-surface-container-high sm:flex">
            <span className="text-label-sm text-on-surface-variant">{featured.category}</span>
          </div>
        </Card>
      )}

      <div>
        <h2 className="mb-3 text-headline-md text-on-background">In Progress</h2>
        {attempts.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading…</p>
        ) : inProgress.length > 0 ? (
          <div className="grid gap-md sm:grid-cols-2">
            {inProgress.map((attempt) => {
              const percent = attempt.total_questions
                ? Math.round((attempt.current_index / attempt.total_questions) * 100)
                : 0;
              return (
                <Card key={attempt.id}>
                  <p className="text-label-md text-on-background">{attempt.assessment_title}</p>
                  <div className="mt-3 flex items-center justify-between text-label-sm text-on-surface-variant">
                    <span>{percent}% Completed</span>
                    <span>
                      {attempt.current_index}/{attempt.total_questions} questions
                    </span>
                  </div>
                  <ProgressBar value={percent} className="mt-2" />
                  <Button
                    variant="secondary"
                    className="mt-4 w-full"
                    onClick={() => router.push(`/assessments/${attempt.assessment_id}/take?attempt=${attempt.id}`)}
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
        <h2 className="mb-3 text-headline-md text-on-background">All Assessments</h2>
        <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
          {(assessments.data ?? []).map((assessment) => (
            <Card key={assessment.id}>
              <div className="mb-2 flex items-center gap-2">
                {assessment.level && <Badge>{assessment.level}</Badge>}
                <span className="text-label-sm text-on-surface-variant">{assessment.category}</span>
              </div>
              <p className="text-headline-md text-on-background">{assessment.title}</p>
              <p className="mt-2 text-body-md text-on-surface-variant">{assessment.description}</p>
              <p className="mt-2 text-label-sm text-on-surface-variant">
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

function ManageAssessments() {
  const role = useAuthStore((s) => s.user?.role);
  const assessments = useAsync(() => api.myAssessments(), []);

  return (
    <div className="flex flex-col gap-lg">
      <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-headline-lg text-on-background">Assessments</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {role === "company"
              ? "Create internship screening assessments and track candidate performance."
              : "Manage skill assessments available to every learner on Lexep."}
          </p>
        </div>
        <div className="flex gap-2">
          {role === "company" && (
            <Button href="/assessments/leaderboard" variant="secondary">
              <Trophy className="h-4 w-4" /> Leaderboard
            </Button>
          )}
          <Button href="/assessments/new">
            <Plus className="h-4 w-4" /> New Assessment
          </Button>
        </div>
      </Card>

      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {assessments.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading…</p>
        ) : assessments.data && assessments.data.length > 0 ? (
          assessments.data.map((a) => (
            <Card key={a.id}>
              <div className="mb-2 flex items-center gap-2">
                {a.level && <Badge>{a.level}</Badge>}
                <span className="text-label-sm text-on-surface-variant">{a.category}</span>
              </div>
              <p className="text-headline-md text-on-background">{a.title}</p>
              <p className="mt-2 text-body-md text-on-surface-variant">{a.description}</p>
              <p className="mt-2 text-label-sm text-on-surface-variant">
                {a.question_count} questions · {a.duration_minutes} min
              </p>
            </Card>
          ))
        ) : (
          <p className="text-body-md text-on-surface-variant">No assessments created yet.</p>
        )}
      </div>
    </div>
  );
}

function AssessmentsContent() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === "admin" || role === "company") return <ManageAssessments />;
  return <LearnerAssessmentHub />;
}

export default function AssessmentsPage() {
  return (
    <SharedShell>
      <AssessmentsContent />
    </SharedShell>
  );
}
