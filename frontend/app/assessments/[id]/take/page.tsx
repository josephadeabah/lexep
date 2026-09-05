"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Radio } from "@/components/ui/Radio";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { AuthGuard } from "@/components/layout/AuthGuard";

function TakeAssessmentContent() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const attemptId = Number(searchParams.get("attempt"));

  const progress = useAsync(() => api.getAttemptProgress(attemptId), [attemptId]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleNext() {
    if (!progress.data?.question || !selectedOption) return;
    setIsSubmitting(true);
    try {
      const next = await api.submitAnswer(attemptId, progress.data.question.id, selectedOption);
      setSelectedOption(null);
      if (next.is_complete) {
        router.push(`/assessments/attempts/${attemptId}/results`);
      } else {
        progress.refetch();
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (progress.isLoading) return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const p = progress.data;
  if (!p || !p.question) return <p className="text-body-md text-on-surface-variant">No questions available.</p>;

  const percent = (p.current_index / p.total_questions) * 100;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-surface">
      <div className="flex items-center justify-between border-b border-outline-variant/40 px-gutter py-4">
        <span className="flex items-center gap-2 text-label-md text-on-background">
          <span className="text-headline-md text-primary">Lexep</span>
          <span className="text-on-surface-variant">| {p.assessment_title}</span>
        </span>
        <button
          onClick={() => router.push("/assessments")}
          className="flex items-center gap-1 text-label-md text-on-surface-variant hover:text-primary"
        >
          <X className="h-4 w-4" /> Exit Quiz
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden w-64 flex-shrink-0 overflow-y-auto border-r border-outline-variant/40 p-md md:block">
          <p className="text-headline-md text-on-background">Question Map</p>
          <div className="mt-2 flex items-center justify-between text-label-sm text-on-surface-variant">
            <span>Progress</span>
            <span>
              {p.current_index + 1}/{p.total_questions}
            </span>
          </div>
          <ProgressBar value={percent} className="mt-2" />

          <ul className="mt-md flex flex-col gap-1">
            {Array.from({ length: p.total_questions }).map((_, i) => {
              const done = i < p.current_index;
              const current = i === p.current_index;
              return (
                <li
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2",
                    current && "bg-surface-container-low"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-label-sm",
                      done && "bg-primary-container text-on-primary-container",
                      current && !done && "border-2 border-primary-container text-primary",
                      !done && !current && "border border-outline-variant text-on-surface-variant"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="text-label-sm text-on-surface">Question {i + 1}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        <main className="flex-1 overflow-y-auto px-gutter py-lg">
          <div className="mx-auto max-w-2xl">
            <p className="text-label-sm uppercase tracking-wide text-primary">{p.assessment_title}</p>
            <h1 className="mt-2 text-headline-lg text-on-background">{p.question.prompt}</h1>

            {p.question.image_url && (
              <div className="mt-md overflow-hidden rounded-lg border border-outline-variant">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.question.image_url} alt="" className="w-full" />
              </div>
            )}

            <div className="mt-lg flex flex-col gap-3">
              {p.question.options.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md border p-4 transition",
                    selectedOption === option.id ? "border-primary-container bg-surface-container-low" : "border-outline-variant"
                  )}
                >
                  <Radio
                    name="answer"
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                  />
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-surface-container-high text-label-sm uppercase">
                    {option.id}
                  </span>
                  <span className="text-body-md text-on-surface">{option.text}</span>
                </label>
              ))}
            </div>

            <div className="mt-lg flex items-center justify-between border-t border-outline-variant/40 pt-md">
              <Button variant="ghost" onClick={handleNext} disabled={isSubmitting}>
                Skip Question
              </Button>
              <Button onClick={handleNext} disabled={!selectedOption || isSubmitting}>
                {isSubmitting ? "Saving…" : "Next Question →"}
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function TakeAssessmentPage() {
  return (
    <AuthGuard>
      <TakeAssessmentContent />
    </AuthGuard>
  );
}
