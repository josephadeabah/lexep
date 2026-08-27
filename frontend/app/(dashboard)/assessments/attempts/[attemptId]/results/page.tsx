"use client";

import { useParams, useRouter } from "next/navigation";
import { Award, Download, Share2, ArrowRight, CheckCircle2, Clock, FileText, Users } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";
import { Badge } from "@/components/ui/badge/Badge";

export default function AssessmentResultsPage() {
  const params = useParams<{ attemptId: string }>();
  const router = useRouter();
  const attemptId = Number(params.attemptId);
  const results = useAsync(() => api.getAttemptResults(attemptId), [attemptId]);

  if (results.isLoading) return <p className="text-base text-[#6d6a66]">Loading…</p>;
  const r = results.data;
  if (!r) return <p className="text-base text-[#ba1a1a]">Results not found.</p>;

  // Recommended paths based on performance (mock data - replace with API)
  const recommendedPaths = [
    {
      title: "Structural Analysis II",
      description: "Dive deeper into dynamic loads, lateral forces, and advanced materials behaviors under extreme stress conditions.",
      duration: "12 Hours",
      modules: "4 Modules",
      level: "Intermediate",
      image: "/images/internship.jpg",
    },
    {
      title: "Concrete Design Principles",
      description: "Apply your statics knowledge to reinforced concrete structural design, focusing on safety and modern standards.",
      duration: "16 Hours",
      modules: "6 Modules",
      level: "Intermediate",
      image: "/images/cover-texture.jpg",
    },
    {
      title: "Material Stress Workshop",
      description: "Strengthen your understanding of material stress and fatigue through a 1-on-1 mentored workshop.",
      duration: "1-on-1",
      modules: "Mentored",
      level: "Suggested Focus",
      image: null,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-[#6d6a66]">
        <button 
          onClick={() => router.push("/assessments")} 
          className="hover:text-[#735c00]"
        >
          ← Back to Dashboard
        </button>
        <span>/</span>
        <span>{r.assessment_title}</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
            Assessment Complete
          </h2>
        </div>
        <Button variant="ghost" className="flex items-center gap-2">
          <Download className="h-4 w-4" /> Download Report
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Main Score Card */}
        <Card className="p-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="text-xs font-bold tracking-wide text-[#735c00] uppercase">
                Final Score
              </p>
              <p className="mt-2 text-7xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
                {Math.round(r.score)}%
              </p>
              <p className="mt-2 text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
                {r.mastery_label}
              </p>
              <p className="mt-2 max-w-sm text-base text-[#6d6a66]">
                You have demonstrated exceptional understanding of load distribution, statics, and material behavior principles.
              </p>
              
              <div className="mt-4">
                <Badge tone="success">
                  <CheckCircle2 className="mr-1 h-3 w-3" /> Skill Verified
                </Badge>
              </div>
            </div>

            {/* Award Icon - top right */}
            <span className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full border-4 border-[#d4af37] bg-[#fffdf8]">
              <Award className="h-14 w-14 text-[#735c00]" />
            </span>
          </div>

          {/* Buttons - full width below */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button 
              variant="secondary" 
              className="flex flex-1 items-center justify-center gap-2"
            >
              <Share2 className="h-4 w-4" /> Share to Profile
            </Button>
            <Button 
              href="/assessments"
              className="flex flex-1 items-center justify-center gap-2"
            >
              Continue Learning
            </Button>
          </div>
        </Card>

        {/* Topic Breakdown Card */}
        <Card className="p-8">
          <h2 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
            Topic Breakdown
          </h2>
          <div className="mt-4 flex flex-col gap-4">
            {r.topic_breakdown.map((t) => (
              <div key={t.topic}>
                <div className="flex items-center justify-between text-sm text-[#6d6a66]">
                  <span>{t.topic}</span>
                  <span className="font-semibold text-[#1b1c1c]">{t.percent}%</span>
                </div>
                <ProgressBar value={t.percent} className="mt-1" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommended Next Paths */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
              Recommended Next Paths
            </h2>
            <p className="mt-1 text-sm text-[#6d6a66]">
              Based on your performance in {r.assessment_title}.
            </p>
          </div>
          <a href="#" className="text-sm font-semibold text-[#735c00]">
            View All →
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recommendedPaths.map((path, index) => (
            <Card key={path.title} className="flex flex-col overflow-hidden">
              {/* Image Section */}
              <div className="relative h-48 bg-[#f5f3f3]">
                {path.image ? (
                  <img 
                    src={path.image} 
                    alt={path.title} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#735c00]">
                    <Users className="h-16 w-16 text-[#d4af37]" />
                  </div>
                )}
                <Badge className="absolute top-4 left-4 bg-[#1b1c1c] text-white">
                  {path.level}
                </Badge>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
                  {path.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-[#6d6a66]">
                  {path.description}
                </p>

                {/* Meta Info */}
                <div className="mt-4 flex items-center gap-4 text-sm text-[#6d6a66]">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {path.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" /> {path.modules}
                  </span>
                </div>

                {/* Action Button */}
                {path.title === "Material Stress Workshop" ? (
                  <Button variant="outline" className="mt-4 w-full">
                    Book Mentor
                  </Button>
                ) : (
                  <Button variant="secondary" className="mt-4 w-full">
                    Enroll Path
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}