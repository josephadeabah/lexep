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

  // Only show loading on initial load, not during refetch
  if (progress.isLoading && !progress.data) {
    return <p className="text-base text-[#6d6a66]">Loading…</p>;
  }

  const p = progress.data;
  if (!p || !p.question) return <p className="text-base text-[#6d6a66]">No questions available.</p>;

  const percent = (p.current_index / p.total_questions) * 100;

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-[#fbf9f8]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e0d8c9] bg-white px-6 py-4">
        <span className="flex items-center gap-2">
          <span className="font-['Hanken_Grotesk'] text-2xl font-bold tracking-[-0.04em] text-[#735c00]">
            Lexep
          </span>
          <span className="text-sm text-[#6d6a66]">| {p.assessment_title}</span>
        </span>
        <button
          onClick={() => router.push("/assessments")}
          className="flex items-center gap-1 text-sm text-[#6d6a66] hover:text-[#735c00]"
        >
          <X className="h-4 w-4" /> Exit Quiz
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Question Map Sidebar */}
        <aside className="hidden w-72 flex-shrink-0 overflow-y-auto border-r border-[#e0d8c9] bg-white p-6 md:block">
          <p className="font-['Hanken_Grotesk'] text-xl font-semibold tracking-[-0.02em] text-[#1b1c1c]">
            Question Map
          </p>
          <div className="mt-2 flex items-center justify-between text-sm text-[#6d6a66]">
            <span>Progress</span>
            <span>
              {p.current_index + 1}/{p.total_questions}
            </span>
          </div>
          <ProgressBar value={percent} className="mt-2" />

          <ul className="mt-6 flex flex-col gap-2">
            {Array.from({ length: p.total_questions }).map((_, i) => {
              const done = i < p.current_index;
              const current = i === p.current_index;
              return (
                <li
                  key={i}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2",
                    current && "bg-[#f5f3f3]"
                  )}
                >
                  <span
                    className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                      done && "bg-[#d4af37] text-[#1b1c1c]",
                      current && !done && "border-2 border-[#d4af37] text-[#735c00]",
                      !done && !current && "border border-[#e0d8c9] text-[#6d6a66]"
                    )}
                  >
                    {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                  </span>
                  <span className="text-sm text-[#1b1c1c]">Question {i + 1}</span>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-8 py-10">
          <div className="mx-auto max-w-3xl">
            <p className="text-xs font-bold tracking-wide text-[#735c00] uppercase">
              {p.assessment_title}
            </p>
            <h2 className="mt-2 font-['Hanken_Grotesk'] text-4xl leading-[1.05] font-bold tracking-[-0.045em] text-[#1b1c1c]">
              {p.question.prompt}
            </h2>

            {p.question.image_url && (
              <div className="mt-6 overflow-hidden rounded-lg border border-[#e0d8c9] bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.question.image_url} alt="" className="w-full" />
              </div>
            )}

            <div className="mt-8 flex flex-col gap-4">
              {p.question.options.map((option) => (
                <label
                  key={option.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-4 rounded-lg border p-5 transition",
                    selectedOption === option.id
                      ? "border-[#d4af37] bg-[#fffdf8]"
                      : "border-[#e0d8c9] bg-white hover:border-[#d4af37]/50"
                  )}
                >
                  <Radio
                    name="answer"
                    checked={selectedOption === option.id}
                    onChange={() => setSelectedOption(option.id)}
                  />
                  <span className="flex h-7 w-7 items-center justify-center rounded bg-[#f0f0f0] text-xs font-bold text-[#6d6a66] uppercase">
                    {option.id}
                  </span>
                  <span className="text-base text-[#1b1c1c]">{option.text}</span>
                </label>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-[#e0d8c9]/40 pt-6">
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
