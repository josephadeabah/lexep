"use client";

import { useState } from "react";
import { Search, Star, Filter, MessageCircle } from "lucide-react";
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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
          Find Your Mentor
        </h1>
        <p className="text-base text-[#6d6a66]">
          Connect with industry experts to guide your career path.
        </p>
        {role === "mentor" && (
          <div className="mt-2">
            <Button href="/mentorship/apply">Become a Mentor</Button>
          </div>
        )}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <Input
            placeholder="Search by name, role, or company..."
            icon={<Search className="h-5 w-5" />}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 rounded-lg border-[#e0d8c9] bg-white text-base"
          />
        </div>
        <Button variant="outline" className="h-12 gap-2 rounded-lg border-[#e0d8c9] px-6">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Mentor Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mentors.isLoading ? (
          <p className="text-base text-[#6d6a66]">Loading mentors…</p>
        ) : filtered.length > 0 ? (
          filtered.map((mentor) => (
            <Card key={mentor.id} className="flex flex-col p-6">
              {/* Mentor Info */}
              <div className="flex flex-col items-center text-center">
                <Avatar
                  name={mentor.user.full_name}
                  src={mentor.user.avatar_url}
                  size={80}
                  className="h-20 w-20 rounded-full"
                />
                <p className="mt-3 font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                  {mentor.user.full_name}
                </p>
                <p className="text-sm font-medium text-[#735c00]">{mentor.title}</p>

                {/* Rating */}
                {mentor.rating > 0 && (
                  <span className="mt-2 flex items-center gap-1 rounded-full bg-[#f5f3f3] px-3 py-1 text-xs font-semibold text-[#6d6a66]">
                    <Star className="h-3 w-3 fill-[#d4af37] text-[#d4af37]" />
                    {mentor.rating.toFixed(1)}
                  </span>
                )}
              </div>

              {/* Bio */}
              <p className="mt-4 flex-1 text-center text-sm leading-relaxed text-[#6d6a66]">
                {mentor.bio}
              </p>

              {/* Skills */}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {mentor.skills.slice(0, 3).map((skill) => (
                  <Badge
                    key={skill}
                    className="rounded-md bg-[#f5f3f3] px-3 py-1.5 text-xs font-medium text-[#6d6a66]"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="mt-6 flex items-center justify-between border-t border-[#e0d8c9]/40 pt-4">
                <span className="flex items-center gap-2 text-sm text-[#6d6a66]">
                  <MessageCircle className="h-4 w-4" /> Free Session
                </span>
                <Button
                  size="sm"
                  href={`/mentorship/${mentor.user.id}`}
                  className="bg-[#d4af37] font-semibold text-[#1b1c1c] hover:bg-[#c9a32e]"
                >
                  Request Session
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-base text-[#6d6a66]">No mentors found yet.</p>
        )}
      </div>
    </div>
  );
}
