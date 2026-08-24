"use client";

import { useState } from "react";
import { Search, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

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
    description: "Master the fundamentals of modern software development, from version control to deployment.",
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
    description: "Hands-on statistics, Python, and machine learning fundamentals for real datasets.",
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
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">Explore Learning Paths</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
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
                "rounded-full px-4 py-2 text-label-md transition",
                category === c
                  ? "bg-primary-container text-on-primary-container"
                  : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </Card>

      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((course) => (
          <Card key={course.title} className="flex flex-col justify-between">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <Badge>{course.level}</Badge>
                <Badge tone={course.tier === "Pro" ? "primary" : "neutral"}>{course.tier}</Badge>
              </div>
              <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{course.category}</p>
              <p className="mt-1 text-headline-md text-on-background">{course.title}</p>
              <p className="mt-2 text-body-md text-on-surface-variant">{course.description}</p>
            </div>
            <div className="mt-4 flex items-center justify-between border-t border-outline-variant/40 pt-3">
              <span className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                <Clock className="h-3.5 w-3.5" /> {course.duration}
              </span>
              <span className="text-label-md text-primary">View Path →</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
