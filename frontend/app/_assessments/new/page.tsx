"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { SharedShell } from "@/components/layout/SharedShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { api } from "@/lib/api";

interface DraftQuestion {
  prompt: string;
  topic: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
}

function blankQuestion(): DraftQuestion {
  return {
    prompt: "",
    topic: "",
    options: [
      { id: "a", text: "" },
      { id: "b", text: "" },
    ],
    correct_option_id: "a",
  };
}

function NewAssessmentContent() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [description, setDescription] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("45");
  const [questions, setQuestions] = useState<DraftQuestion[]>([blankQuestion()]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateQuestion(index: number, patch: Partial<DraftQuestion>) {
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  }

  function updateOption(qIndex: number, optIndex: number, text: string) {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: q.options.map((o, j) => (j === optIndex ? { ...o, text } : o)) } : q
      )
    );
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      await api.createAssessment({
        title,
        category,
        level,
        description,
        duration_minutes: Number(durationMinutes || 45),
        questions: questions
          .filter((q) => q.prompt && q.options.every((o) => o.text))
          .map((q) => ({
            prompt: q.prompt,
            topic: q.topic || undefined,
            options: q.options,
            correct_option_id: q.correct_option_id,
          })),
      });
      router.push("/assessments");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/assessments" className="mb-4 flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Assessments
      </Link>

      <div className="mb-lg">
        <h1 className="text-headline-lg text-on-background">New Assessment</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">Set up a skill assessment or internship screening quiz.</p>
      </div>

      <Card className="flex flex-col gap-md">
        <Input label="Title" placeholder="e.g. Structural Analysis I" value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="grid gap-md sm:grid-cols-3">
          <Input label="Category" placeholder="e.g. Engineering" value={category} onChange={(e) => setCategory(e.target.value)} />
          <Select label="Level" value={level} onChange={(e) => setLevel(e.target.value)}>
            <option value="">Select level</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </Select>
          <Input label="Duration (mins)" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
        </div>
        <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </Card>

      <div className="mt-md flex flex-col gap-md">
        {questions.map((q, qIndex) => (
          <Card key={qIndex}>
            <div className="flex items-center justify-between">
              <p className="text-label-md text-on-background">Question {qIndex + 1}</p>
              {questions.length > 1 && (
                <button onClick={() => setQuestions((prev) => prev.filter((_, i) => i !== qIndex))} className="text-error">
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="mt-3 flex flex-col gap-3">
              <Textarea placeholder="Question prompt" value={q.prompt} onChange={(e) => updateQuestion(qIndex, { prompt: e.target.value })} className="min-h-[80px]" />
              <Input placeholder="Topic (for score breakdown, optional)" value={q.topic} onChange={(e) => updateQuestion(qIndex, { topic: e.target.value })} />
              {q.options.map((opt, optIndex) => (
                <label key={opt.id} className="flex items-center gap-3">
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correct_option_id === opt.id}
                    onChange={() => updateQuestion(qIndex, { correct_option_id: opt.id })}
                    className="h-4 w-4 accent-current text-primary"
                  />
                  <Input
                    placeholder={`Option ${opt.id.toUpperCase()}`}
                    value={opt.text}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    className="flex-1"
                  />
                </label>
              ))}
              {q.options.length < 5 && (
                <button
                  onClick={() =>
                    updateQuestion(qIndex, {
                      options: [...q.options, { id: String.fromCharCode(97 + q.options.length), text: "" }],
                    })
                  }
                  className="flex items-center gap-1 text-label-sm text-primary hover:underline"
                >
                  <Plus className="h-3.5 w-3.5" /> Add option
                </button>
              )}
            </div>
          </Card>
        ))}
        <Button variant="ghost" onClick={() => setQuestions((prev) => [...prev, blankQuestion()])}>
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>

      <div className="mt-md flex justify-end border-t border-outline-variant/40 pt-md">
        <Button onClick={handleSubmit} disabled={!title || isSubmitting}>
          {isSubmitting ? "Creating…" : "Create Assessment"}
        </Button>
      </div>
    </div>
  );
}

export default function NewAssessmentPage() {
  return (
    <SharedShell>
      <NewAssessmentContent />
    </SharedShell>
  );
}
