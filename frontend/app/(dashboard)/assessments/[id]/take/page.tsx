"use client";

import { useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Radio } from "@/components/ui/radio/Radio";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";

export default function TakeAssessmentPage() {
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
  if (!p || !p.question)
    return <p className="text-body-md text-on-surface-variant">No questions available.</p>;

  const percent = (p.current_index / p.total_questions) * 100;

  return (
    <div className="bg-surface fixed inset-0 z-40 flex flex-col">
      <div className="border-outline-variant/40 px-gutter flex items-center justify-between border-b py-4">
        <span className="text-label-md text-on-background flex items-center gap-2">
          <span className="text-headline-md text-primary">Lexep</span>
          <span className="text-on-surface-variant">| {p.assessment_title}</span>
        </span>
        <button
          onClick={() => router.push("/assessments")}
          className="text-label-md text-on-surface-variant hover:text-primary flex items-center gap-1"
        >
          <X className="h-4 w-4" /> Exit Quiz
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="border-outline-variant/40 p-md hidden w-64 flex-shrink-0 overflow-y-auto border-r md:block">
          <p className="text-headline-md text-on-background">Question Map</p>
          <div className="text-label-sm text-on-surface-variant mt-2 flex items-center justify-between">
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
                      "text-label-sm flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full",
                      done && "bg-primary-container text-on-primary-container",
                      current && !done && "border-primary-container text-primary border-2",
                      !done && !current && "border-outline-variant text-on-surface-variant border"
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

        <main className="px-gutter py-lg flex-1 overflow-y-auto">
          <div className="mx-auto max-w-2xl">
            <p className="text-label-sm text-primary tracking-wide uppercase">
              {p.assessment_title}
            </p>
            <h1 className="text-headline-lg text-on-background mt-2">{p.question.prompt}</h1>

            {p.question.image_url && (
              <div className="mt-md border-outline-variant overflow-hidden rounded-lg border">
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
                    selectedOption === option.id
                      ? "border-primary-container bg-surface-container-low"
                      : "border-outline-variant"
                  )}
                >
                  <Radio
                    name="answer"
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                  />
                  <span className="bg-surface-container-high text-label-sm flex h-6 w-6 items-center justify-center rounded uppercase">
                    {option.id}
                  </span>
                  <span className="text-body-md text-on-surface">{option.text}</span>
                </label>
              ))}
            </div>

            <div className="mt-lg border-outline-variant/40 pt-md flex items-center justify-between border-t">
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
