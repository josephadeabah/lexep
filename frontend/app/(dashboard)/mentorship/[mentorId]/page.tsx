"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Bookmark, Heart, Clock, Globe2 } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge/Badge";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { DonutProgress } from "@/components/ui/donut-progress/DonutProgress";

export default function MentorProfilePage() {
  const params = useParams<{ mentorId: string }>();
  const router = useRouter();
  const mentorId = Number(params.mentorId);
  const mentor = useAsync(() => api.getMentor(mentorId), [mentorId]);
  const packages = useAsync(() => api.mentorPackages(mentorId), [mentorId]);

  if (mentor.isLoading) return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const m = mentor.data;
  if (!m) return <p className="text-body-md text-error">Mentor not found.</p>;

  return (
    <div>
      <button
        onClick={() => router.push("/mentorship")}
        className="text-label-md text-on-surface-variant hover:text-primary mb-4 flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Mentors
      </button>

      <Card className="mb-md flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <Avatar name={m.user.full_name} src={m.user.avatar_url} size={80} />
          <div>
            <h1 className="text-headline-lg text-on-background">{m.user.full_name}</h1>
            <p className="text-body-md text-on-surface-variant">{m.title}</p>
            {m.company && (
              <p className="text-label-sm text-on-surface-variant flex items-center gap-2">
                <Globe2 className="h-3.5 w-3.5" /> {m.company}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-2">
              {m.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button href={`/mentorship/${mentorId}/request`}>
            <Heart className="h-4 w-4" /> Book Session
          </Button>
          <Button variant="ghost">
            <Bookmark className="h-4 w-4" /> Save Profile
          </Button>
        </div>
      </Card>

      <div className="gap-md grid lg:grid-cols-[1fr_320px]">
        <div className="gap-md flex flex-col">
          <Card>
            <h2 className="text-headline-md text-on-background">About Me</h2>
            <p className="text-body-md text-on-surface-variant mt-3 whitespace-pre-line">{m.bio}</p>
          </Card>

          {packages.data && packages.data.length > 0 && (
            <Card>
              <h2 className="text-headline-md text-on-background">Mentorship Packages</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {packages.data.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="border-outline-variant relative rounded-md border p-4"
                  >
                    {pkg.is_popular && (
                      <span className="bg-primary-container text-label-sm text-on-primary-container absolute -top-3 right-3 rounded-full px-2 py-0.5">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center justify-between">
                      <p className="text-label-md text-on-background">{pkg.title}</p>
                      <p className="text-label-md text-primary">
                        {pkg.currency} {pkg.price}
                      </p>
                    </div>
                    <p className="text-body-md text-on-surface-variant mt-2">{pkg.description}</p>
                    <p className="text-label-sm text-on-surface-variant mt-2">
                      {pkg.session_count > 1 ? `${pkg.session_count} × ` : ""}
                      {pkg.duration_minutes}-minute call{pkg.session_count > 1 ? "s" : ""}
                    </p>
                    <Button
                      href={`/mentorship/${mentorId}/request?package=${pkg.id}`}
                      variant={pkg.is_popular ? "secondary" : "ghost"}
                      className="mt-3 w-full"
                    >
                      Select Package
                    </Button>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        <div className="gap-md flex flex-col">
          <Card>
            <h2 className="text-headline-md text-on-background">Availability</h2>
            <div className="text-body-md text-on-surface mt-3 flex flex-col gap-2">
              <span className="flex items-center gap-2">
                <Clock className="text-on-surface-variant h-4 w-4" />{" "}
                {m.hours_per_week ?? "Flexible"}
              </span>
              <span
                className={
                  m.accepting_mentees
                    ? "text-label-sm text-primary"
                    : "text-label-sm text-on-surface-variant"
                }
              >
                {m.accepting_mentees ? "Accepting Mentees" : "Not currently accepting mentees"}
              </span>
            </div>
          </Card>

          {m.rating > 0 && (
            <Card className="bg-inverse-surface text-inverse-on-surface">
              <p className="text-label-md">Profile Match</p>
              <div className="mt-3 flex items-center gap-4">
                <DonutProgress percent={Math.round(m.rating * 20)} size={64} />
                <p className="text-label-sm text-[#c9c7c6]">
                  Based on your career goals and shared interests.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
