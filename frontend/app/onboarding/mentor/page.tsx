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
import styles from "../onboarding.module.css";

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
    <div className={styles.shell}>
      <div className={styles.content}>
        <div className={styles.progressLabel}>
          <span>STEP 1 OF 1</span>
          <span className={styles.progressLabelRight}>Finalizing Profile</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: "100%" }} />
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>Refine Your Mentorship Profile</h1>
            <p className={styles.cardSubtitle}>
              Help us connect you with the right mentees by defining your approach and preferences.
            </p>
          </div>

          <div className={styles.formGrid}>
            <div>
              <h2 className={styles.sectionTitle}>Mentoring Style</h2>
              <p className={styles.sectionSubtitle}>
                What is your primary approach to guiding mentees?
              </p>
              <div className={styles.optionsGridThree}>
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(styles.optionCard, style === s.id && styles.optionCardSelected)}
                  >
                    <span className={styles.optionIcon}>
                      <s.icon className="h-5 w-5" />
                    </span>
                    <div>
                      <p className={styles.optionTitle}>{s.title}</p>
                      <p className={styles.optionDescription}>{s.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Preferred Mentee Level</h2>
              <p className={styles.sectionSubtitle}>
                Select all that apply based on your current capacity.
              </p>
              <div className={styles.formGrid}>
                {LEVELS.map((level) => (
                  <label
                    key={level.id}
                    className={cn(
                      styles.checkboxCard,
                      levels.includes(level.id) && styles.checkboxCardSelected
                    )}
                  >
                    <Checkbox
                      checked={levels.includes(level.id)}
                      onChange={() => toggleLevel(level.id)}
                    />
                    <div>
                      <p className={styles.optionTitle}>{level.title}</p>
                      <p className={styles.optionDescription}>{level.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h2 className={styles.sectionTitle}>Communication Tools</h2>
              <p className={styles.sectionSubtitle}>How do you prefer to conduct sessions?</p>
              <div className={styles.optionsGridFour}>
                {TOOLS.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => toggleTool(tool.id)}
                    className={cn(
                      styles.optionCard,
                      tools.includes(tool.id) && styles.optionCardSelected
                    )}
                  >
                    <span className={styles.optionIcon}>
                      <tool.icon className="h-5 w-5" />
                    </span>
                    <span className={styles.optionTitle}>{tool.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.footer} style={{ justifyContent: "flex-end" }}>
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
