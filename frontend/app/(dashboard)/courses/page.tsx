"use client";

import { useState } from "react";
import { Search, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Badge } from "@/components/ui/badge/Badge";

// Static catalog for now. Swap for `api.listCourses()` once a Course model
// is added to the backend — the shape below is intentionally close to what
// that endpoint would return, so the migration is a drop-in replacement.
const CATEGORIES = ["All", "Technology", "Business", "Creative"] as const;

const COURSES = [
  {
    title: "Software Engineering 101",
    category: "Technology",
    level: "Beginner",
    tier: "Free",
    duration: "12 Weeks",
    description:
      "Master the fundamentals of modern software development, from version control to deployment.",
  },
  {
    title: "Product Strategy & Growth",
    category: "Business",
    level: "Intermediate",
    tier: "Pro",
    duration: "8 Weeks",
    description: "Learn how to conceptualize, launch, and scale digital products that people love.",
  },
  {
    title: "UI/UX Foundations",
    category: "Creative",
    level: "Beginner",
    tier: "Free",
    duration: "10 Weeks",
    description: "Understand user-centric design principles, wireframing, and prototyping.",
  },
  {
    title: "Data Science Bootcamp",
    category: "Technology",
    level: "Intermediate",
    tier: "Pro",
    duration: "14 Weeks",
    description:
      "Hands-on statistics, Python, and machine learning fundamentals for real datasets.",
  },
  {
    title: "Digital Marketing Essentials",
    category: "Business",
    level: "Beginner",
    tier: "Free",
    duration: "6 Weeks",
    description: "SEO, paid acquisition, and content strategy for early-stage products.",
  },
  {
    title: "Architecture & Systems Thinking",
    category: "Creative",
    level: "Advanced",
    tier: "Pro",
    duration: "9 Weeks",
    description: "Design sustainable, scalable structures — physical and digital.",
  },
];

export default function CoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");

  const filtered = COURSES.filter(
    (course) =>
      (category === "All" || course.category === category) &&
      `${course.title} ${course.description}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.045em]">
          Explore Learning Paths
        </h1>
        <p className="mt-1 text-base text-[#6d6a66]">
          Discover structured curriculums designed by industry architects to elevate your career.
        </p>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <Input
            placeholder="Search courses, skills, or mentors…"
            icon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                category === c
                  ? "bg-[#d4af37] text-[#1b1c1c]"
                  : "bg-[#f0f0f0] text-[#6d6a66] hover:bg-[#e0e0e0]"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <Card key={course.title} className="flex flex-col justify-between">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <Badge>{course.level}</Badge>
                <Badge tone={course.tier === "Pro" ? "primary" : "neutral"}>{course.tier}</Badge>
              </div>
              <p className="text-xs text-[#6d6a66] uppercase tracking-wide">
                {course.category}
              </p>
              <p className="mt-1 text-xl font-semibold text-[#1b1c1c] font-['Hanken_Grotesk'] tracking-[-0.02em]">
                {course.title}
              </p>
              <p className="mt-2 text-base text-[#6d6a66]">{course.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-[#e0d8c9]/40 pt-3">
              <span className="flex items-center gap-2 text-sm text-[#6d6a66]">
                <Clock className="h-3.5 w-3.5" /> {course.duration}
              </span>
              <span className="text-sm font-semibold text-[#735c00]">View Path →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}