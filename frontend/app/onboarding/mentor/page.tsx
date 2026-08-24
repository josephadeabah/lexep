"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Terminal,
  TrendingUp,
  ClipboardEdit,
  MessagesSquare,
  MessageCircle,
  Video,
  ImageIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { api } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

const STYLES = [
  {
    id: "technical_guidance",
    title: "Technical Guidance",
    description: "Focus on code reviews, architecture, and technical skill building.",
    icon: Terminal,
  },
  {
    id: "career_coaching",
    title: "Career Coaching",
    description: "Navigation, leadership, and long-term professional growth.",
    icon: TrendingUp,
  },
  {
    id: "project_review",
    title: "Project Review",
    description: "Feedback on portfolios, specific deliverables, and presentations.",
    icon: ClipboardEdit,
  },
];

const LEVELS = [
  {
    id: "beginner",
    title: "Beginner",
    description: "Early in their journey, needs foundational guidance.",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description: "Has basic experience, looking to specialize or level up.",
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Experienced professionals seeking specific high-level advice.",
  },
];

const TOOLS = [
  { id: "Slack", icon: MessagesSquare },
  { id: "WhatsApp", icon: MessageCircle },
  { id: "Zoom", icon: Video },
  { id: "Google Meet", icon: ImageIcon },
];

export default function MentorOnboardingPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [style, setStyle] = useState("technical_guidance");
  const [levels, setLevels] = useState<string[]>(["beginner"]);
  const [tools, setTools] = useState<string[]>(["Slack", "Zoom"]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleLevel(id: string) {
    setLevels((prev) => (prev.includes(id) ? prev.filter((l) => l !== id) : [...prev, id]));
  }

  function toggleTool(id: string) {
    setTools((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]));
  }

  async function handleSave() {
    setIsSubmitting(true);
    try {
      const user = await api.onboardMentor({
        mentoring_style: style,
        preferred_mentee_levels: levels,
        communication_tools: tools,
      });
      setUser(user);
      router.push("/mentorship/apply");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="px-gutter min-h-screen bg-surface py-xl">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between text-label-sm text-on-surface-variant">
          <span>STEP 1 OF 1</span>
          <span className="font-label-md text-primary">Finalizing Profile</span>
        </div>
        <div className="mb-lg h-1 w-full rounded-full bg-primary-container" />

        <div className="card-level1 p-md">
          <div className="text-center">
            <h1 className="text-headline-lg text-on-background">Refine Your Mentorship Profile</h1>
            <p className="mx-auto mt-2 max-w-lg text-body-md text-on-surface-variant">
              Help us connect you with the right mentees by defining your approach and preferences.
            </p>
          </div>

          <div className="mt-lg">
            <h2 className="text-headline-md text-on-background">Mentoring Style</h2>
            <p className="text-label-sm text-on-surface-variant">
              What is your primary approach to guiding mentees?
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={cn(
                    "flex flex-col items-start gap-2 rounded-md border p-4 text-left transition",
                    style === s.id
                      ? "border-primary-container bg-surface-container-low"
                      : "border-outline-variant hover:bg-surface-container-low"
                  )}
                >
                  <s.icon className="h-5 w-5 text-on-surface" />
                  <p className="text-label-md text-on-background">{s.title}</p>
                  <p className="text-label-sm text-on-surface-variant">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-lg border-t border-outline-variant/40 pt-md">
            <h2 className="text-headline-md text-on-background">Preferred Mentee Level</h2>
            <p className="text-label-sm text-on-surface-variant">
              Select all that apply based on your current capacity.
            </p>
            <div className="mt-3 flex flex-col gap-2">
              {LEVELS.map((level) => (
                <label
                  key={level.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md border border-outline-variant px-4 py-3 hover:bg-surface-container-low"
                >
                  <Checkbox
                    checked={levels.includes(level.id)}
                    onChange={() => toggleLevel(level.id)}
                  />
                  <span>
                    <span className="block text-body-md text-on-surface">{level.title}</span>
                    <span className="block text-label-sm text-on-surface-variant">
                      {level.description}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-lg border-t border-outline-variant/40 pt-md">
            <h2 className="text-headline-md text-on-background">Communication Tools</h2>
            <p className="text-label-sm text-on-surface-variant">
              How do you prefer to conduct sessions?
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TOOLS.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => toggleTool(tool.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-md border p-4 transition",
                    tools.includes(tool.id)
                      ? "border-primary-container bg-surface-container-low"
                      : "border-outline-variant hover:bg-surface-container-low"
                  )}
                >
                  <tool.icon className="h-5 w-5 text-on-surface" />
                  <span className="text-label-sm text-on-surface">{tool.id}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-lg flex justify-end border-t border-outline-variant/40 pt-md">
            <Button variant="secondary" onClick={handleSave} disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Profile →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
