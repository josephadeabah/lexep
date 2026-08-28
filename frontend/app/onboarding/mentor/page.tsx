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
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
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
    <div className="min-h-screen bg-[#fbf9f8]">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Progress */}
        <div className="mb-6 flex items-center justify-between text-xs font-semibold">
          <span className="text-[#6d6a66]">STEP 1 OF 1</span>
          <span className="text-[#735c00]">Finalizing Profile</span>
        </div>
        <div className="mb-8 h-1 rounded-full bg-[#e0d8c9]">
          <div className="h-1 rounded-full bg-[#d4af37]" style={{ width: "100%" }} />
        </div>

        <div className="rounded-2xl border border-[#e0d8c9] bg-white p-8 shadow-sm sm:p-10">
          {/* Header */}
          <div className="mb-8 text-center">
            <h2 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
              Refine Your Mentorship Profile
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[#6d6a66]">
              Help us connect you with the right mentees by defining your approach and preferences.
            </p>
          </div>

          <div className="space-y-8">
            {/* Mentoring Style */}
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                Mentoring Style
              </h2>
              <p className="mt-1 text-sm text-[#6d6a66]">
                What is your primary approach to guiding mentees?
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      "flex flex-col items-start gap-2 rounded-xl border p-5 text-left transition",
                      style === s.id
                        ? "border-[#d4af37] bg-[#fffdf8]"
                        : "border-[#e0d8c9] hover:border-[#d4af37]"
                    )}
                  >
                    <s.icon className="h-5 w-5 text-[#1b1c1c]" />
                    <p className="text-sm font-semibold text-[#1b1c1c]">{s.title}</p>
                    <p className="text-xs text-[#6d6a66]">{s.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preferred Mentee Level */}
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                Preferred Mentee Level
              </h2>
              <p className="mt-1 text-sm text-[#6d6a66]">
                Select all that apply based on your current capacity.
              </p>
              <div className="mt-4 space-y-3">
                {LEVELS.map((level) => (
                  <label
                    key={level.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition",
                      levels.includes(level.id)
                        ? "border-[#d4af37] bg-[#fffdf8]"
                        : "border-[#e0d8c9] hover:border-[#d4af37]"
                    )}
                  >
                    <Checkbox
                      checked={levels.includes(level.id)}
                      onChange={() => toggleLevel(level.id)}
                    />
                    <div>
                      <p className="text-sm font-semibold text-[#1b1c1c]">{level.title}</p>
                      <p className="text-xs text-[#6d6a66]">{level.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Communication Tools */}
            <div>
              <h2 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                Communication Tools
              </h2>
              <p className="mt-1 text-sm text-[#6d6a66]">How do you prefer to conduct sessions?</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-4 transition",
                      tools.includes(tool.id)
                        ? "border-[#d4af37] bg-[#fffdf8]"
                        : "border-[#e0d8c9] hover:border-[#d4af37]"
                    )}
                  >
                    <tool.icon className="h-5 w-5 text-[#1b1c1c]" />
                    <span className="text-sm font-medium text-[#1b1c1c]">{tool.id}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-[#e0d8c9]/40 pt-6">
              <Button variant="secondary" onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "Saving…" : "Save Profile →"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
