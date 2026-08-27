"use client";

import { useState } from "react";
import { Search, Star } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { useAuthStore } from "@/lib/auth-store";

export default function MentorshipPage() {
  const role = useAuthStore((s) => s.user?.role);
  const [query, setQuery] = useState("");
  const mentors = useAsync(() => api.findMentors(), []);

  const filtered = (mentors.data ?? []).filter((m) =>
    `${m.user.full_name} ${m.title ?? ""} ${m.company ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="gap-lg flex flex-col">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-background">Find Your Mentor</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Connect with industry experts to guide your career path.
          </p>
        </div>
        {role === "mentor" && <Button href="/mentorship/apply">Become a Mentor</Button>}
      </div>

      <Card>
        <Input
          placeholder="Search by name, role, or company…"
          icon={<Search className="h-4 w-4" />}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </Card>

      <div className="gap-md grid sm:grid-cols-2 lg:grid-cols-3">
        {mentors.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading mentors…</p>
        ) : filtered.length > 0 ? (
          filtered.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col justify-between">
              <div>
                <div className="flex items-start gap-3">
                  <Avatar name={mentor.user.full_name} src={mentor.user.avatar_url} size={48} />
                  <div>
                    <p className="text-label-md text-on-background flex items-center gap-2">
                      {mentor.user.full_name}
                      {mentor.rating > 0 && (
                        <span className="bg-surface-container-high text-label-sm flex items-center gap-1 rounded-full px-2 py-0.5">
                          <Star className="fill-primary-container text-primary-container h-3 w-3" />{" "}
                          {mentor.rating.toFixed(1)}
                        </span>
                      )}
                    </p>
                    <p className="text-label-sm text-primary">{mentor.title}</p>
                  </div>
                </div>
                <p className="text-body-md text-on-surface-variant mt-3 line-clamp-3">
                  {mentor.bio}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mentor.skills.slice(0, 3).map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
              </div>
              <div className="border-outline-variant/40 mt-4 flex items-center justify-between border-t pt-3">
                <span className="text-label-sm text-on-surface-variant">Free Session</span>
                <Button size="sm" href={`/mentorship/${mentor.user.id}`}>
                  Request Session
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-body-md text-on-surface-variant">No mentors found yet.</p>
        )}
      </div>
    </div>
  );
}
