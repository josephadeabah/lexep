"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Clock, Plus, GraduationCap, Users, TrendingUp } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { SharedShell } from "@/components/layout/SharedShell";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import { useAuthStore } from "@/lib/auth-store";

const CATEGORIES = ["All", "Core Foundation", "Advanced Seminar", "Practicum", "Technology", "Business", "Creative"];

function LearnerCourseBrowser() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const courses = useAsync(() => api.listCourses({ published_only: true, q: query || undefined, page, page_size: 9 }), [query, page]);
  const enrollments = useAsync(() => api.myEnrollments(), []);
  const [enrollingId, setEnrollingId] = useState<number | null>(null);

  const enrolledIds = new Set((enrollments.data ?? []).map((e) => e.course_id));

  async function handleEnroll(id: number) {
    setEnrollingId(id);
    try {
      await api.enrollInCourse(id);
      enrollments.refetch();
    } finally {
      setEnrollingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">Explore Learning Paths</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Discover structured curriculums designed by industry architects to elevate your career.
        </p>
      </div>

      <Card>
        <Input
          placeholder="Search courses, skills, or mentors…"
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
      </Card>

      {courses.isLoading ? (
        <p className="text-body-md text-on-surface-variant">Loading…</p>
      ) : courses.data && courses.data.items.length > 0 ? (
        <>
          <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {courses.data.items.map((course) => (
              <Card key={course.id} className="flex flex-col justify-between">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    {course.level && <Badge>{course.level}</Badge>}
                    <Badge tone={course.is_paid ? "primary" : "neutral"}>{course.is_paid ? `$${course.price}` : "Free"}</Badge>
                  </div>
                  <p className="text-label-sm uppercase tracking-wide text-on-surface-variant">{course.category}</p>
                  <p className="mt-1 text-headline-md text-on-background">{course.title}</p>
                  <p className="mt-2 text-body-md text-on-surface-variant">{course.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-outline-variant/40 pt-3">
                  <span className="flex items-center gap-2 text-label-sm text-on-surface-variant">
                    <Clock className="h-3.5 w-3.5" /> {course.duration_weeks ? `${course.duration_weeks} weeks` : "Self-paced"}
                  </span>
                  {enrolledIds.has(course.id) ? (
                    <span className="text-label-md text-primary">Enrolled</span>
                  ) : (
                    <button
                      onClick={() => handleEnroll(course.id)}
                      disabled={enrollingId === course.id}
                      className="text-label-md text-primary hover:underline"
                    >
                      {enrollingId === course.id ? "Enrolling…" : "Enroll →"}
                    </button>
                  )}
                </div>
              </Card>
            ))}
          </div>
          <Pagination page={courses.data.page} totalPages={courses.data.total_pages} onPageChange={setPage} />
        </>
      ) : (
        <p className="text-body-md text-on-surface-variant">No courses match your search yet.</p>
      )}
    </div>
  );
}

function CurriculumManagement() {
  const [page, setPage] = useState(1);
  const stats = useAsync(() => api.courseStats(), []);
  const courses = useAsync(() => api.listCourses({ mine_only: true, page, page_size: 10 }), [page]);

  return (
    <div className="flex flex-col gap-lg">
      <Card className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-headline-lg text-on-background">Curriculum Management</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Manage and monitor all your courses.</p>
        </div>
        <Button href="/courses/new">
          <Plus className="h-4 w-4" /> Create New Course
        </Button>
      </Card>

      <div className="grid gap-md sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <GraduationCap className="h-4 w-4 text-primary" /> TOTAL ACTIVE COURSES
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.active_courses ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <Users className="h-4 w-4 text-primary" /> TOTAL ENROLLED STUDENTS
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.total_enrolled ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <TrendingUp className="h-4 w-4 text-primary" /> AVG. COMPLETION RATE
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.avg_completion_rate ?? "—"}%
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-b border-outline-variant/40 p-md">
          <h2 className="text-headline-md text-on-background">Course Directory</h2>
        </div>
        {courses.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
        ) : courses.data && courses.data.items.length > 0 ? (
          <>
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
                <tr>
                  <th className="px-md py-3 font-normal">Course Title</th>
                  <th className="px-md py-3 font-normal">Category</th>
                  <th className="px-md py-3 font-normal">Status</th>
                  <th className="px-md py-3 font-normal text-right">Students</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/40">
                {courses.data.items.map((course) => (
                  <tr key={course.id}>
                    <td className="px-md py-4">
                      <p className="text-label-md text-on-background">{course.title}</p>
                      <p className="text-label-sm text-on-surface-variant">Updated {formatDate(course.created_at)}</p>
                    </td>
                    <td className="px-md py-4 text-body-md text-on-surface">{course.category ?? "—"}</td>
                    <td className="px-md py-4">
                      <Badge tone={course.status === "published" ? "success" : "neutral"} dot>
                        {course.status === "published" ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-md py-4 text-right text-body-md text-on-surface">
                      {course.status === "published" ? course.enrolled_count : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-md">
              <Pagination page={courses.data.page} totalPages={courses.data.total_pages} onPageChange={setPage} />
            </div>
          </>
        ) : (
          <p className="p-md text-body-md text-on-surface-variant">
            You haven&apos;t created any courses yet. <Link href="/courses/new" className="text-primary hover:underline">Create one →</Link>
          </p>
        )}
      </Card>
    </div>
  );
}

function CoursesContent() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === "admin" || role === "company") return <CurriculumManagement />;
  return <LearnerCourseBrowser />;
}

export default function CoursesPage() {
  return (
    <SharedShell>
      <CoursesContent />
    </SharedShell>
  );
}
