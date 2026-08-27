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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
          Skill Assessment Hub
        </h1>
        <p className="mt-2 text-base text-[#6d6a66]">
          Validate your expertise across domains and unlock advanced learning paths.
        </p>
      </div>

      {/* Featured Assessment */}
      {featured && (
        <Card className="grid gap-6 sm:grid-cols-2">
          <div className="p-6">
            <div className="flex gap-2">
              <Badge tone="primary">
                <Star className="mr-1 h-3 w-3" /> Featured
              </Badge>
              {featured.level && <Badge>{featured.level}</Badge>}
            </div>
            <h2 className="mt-4 text-3xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.04em]">
              {featured.title}
            </h2>
            <p className="mt-2 text-base text-[#6d6a66]">{featured.description}</p>
            <p className="mt-2 text-sm text-[#6d6a66]">
              {featured.question_count} questions · {featured.duration_minutes} minutes
            </p>
            <Button className="mt-6" onClick={() => start(featured.id)}>
              Start Assessment
            </Button>
          </div>
          <div className="hidden items-center justify-center rounded-lg bg-[#f5f3f3] sm:flex">
            <span className="text-sm text-[#6d6a66]">{featured.category}</span>
          </div>
        </Card>
      )}

      {/* In Progress */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
            In Progress
          </h2>
          <a href="#" className="text-sm font-semibold text-[#735c00]">
            View All
          </a>
        </div>
        {attempts.isLoading ? (
          <p className="text-base text-[#6d6a66]">Loading…</p>
        ) : inProgress.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {inProgress.map((attempt) => {
              const percent = attempt.total_questions
                ? Math.round((attempt.current_index / attempt.total_questions) * 100)
                : 0;
              return (
                <Card key={attempt.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-semibold text-[#1b1c1c]">
                        {attempt.assessment_title}
                      </p>
                      <p className="text-sm text-[#6d6a66]">
                        {attempt.current_index}/{attempt.total_questions} questions
                      </p>
                    </div>
                    <span className="text-2xl">📝</span>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-[#6d6a66]">
                      <span>{percent}% Completed</span>
                      <span>
                        {percent < 50 ? "25 mins left" : "1.5 hrs left"}
                      </span>
                    </div>
                    <ProgressBar value={percent} className="mt-2" />
                  </div>
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
          <p className="text-base text-[#6d6a66]">No assessments in progress.</p>
        )}
      </div>

      {/* All Assessments */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
          All Assessments
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(assessments.data ?? []).map((assessment) => (
            <Card key={assessment.id} className="p-5">
              <div className="mb-2 flex items-center gap-2">
                {assessment.level && <Badge>{assessment.level}</Badge>}
                <span className="text-sm text-[#6d6a66]">{assessment.category}</span>
              </div>
              <p className="text-lg font-semibold text-[#1b1c1c] font-['Hanken_Grotesk']">
                {assessment.title}
              </p>
              <p className="mt-2 text-sm text-[#6d6a66]">{assessment.description}</p>
              <p className="mt-2 text-sm text-[#6d6a66]">
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