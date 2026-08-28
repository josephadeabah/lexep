"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  X,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  Globe2,
  Compass,
  Code2,
  Landmark,
  Heart,
} from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge/Badge";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { cn } from "@/lib/utils";

export default function MentorProfilePage() {
  const params = useParams<{ mentorId: string }>();
  const router = useRouter();
  const mentorId = Number(params.mentorId);
  const mentor = useAsync(() => api.getMentor(mentorId), [mentorId]);
  const packages = useAsync(() => api.mentorPackages(mentorId), [mentorId]);

  if (mentor.isLoading) return <p className="text-base text-[#6d6a66]">Loading…</p>;
  const m = mentor.data;
  if (!m) return <p className="text-base text-[#ba1a1a]">Mentor not found.</p>;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#fbf9f8]">
      {/* Exit Button */}
      <button
        onClick={() => router.push("/mentorship")}
        className="fixed right-6 top-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-[#f5f3f3]"
        aria-label="Close profile"
      >
        <X className="h-5 w-5 text-[#1b1c1c]" />
      </button>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="p-6 text-center">
              <Avatar
                name={m.user.full_name}
                src={m.user.avatar_url}
                size={120}
                className="mx-auto"
              />
              <h2 className="mt-4 font-['Hanken_Grotesk'] text-2xl font-bold text-[#1b1c1c]">
                {m.user.full_name}
              </h2>
              <p className="mt-1 text-sm text-[#6d6a66]">{m.title}</p>

              <Button
                href={`/mentorship/${mentorId}/request`}
                className="mt-4 w-full bg-[#d4af37] font-semibold text-[#1b1c1c] hover:bg-[#c9a32e]"
              >
                <Heart className="h-4 w-4" /> Book Session
              </Button>
              <Button variant="outline" className="mt-2 w-full border-[#e0d8c9]">
                Message
              </Button>

              {/* Stats */}
              <div className="mt-6 space-y-4 border-t border-[#e0d8c9]/40 pt-4 text-left">
                <div className="flex items-center gap-3">
                  <Star className="h-4 w-4 fill-[#d4af37] text-[#d4af37]" />
                  <div>
                    <p className="text-xs font-semibold text-[#6d6a66]">RATING</p>
                    <p className="text-sm font-semibold text-[#1b1c1c]">
                      {m.rating.toFixed(1)} <span className="text-[#6d6a66]">(124)</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-[#6d6a66]" />
                  <div>
                    <p className="text-xs font-semibold text-[#6d6a66]">SESSIONS COMPLETED</p>
                    <p className="text-sm font-semibold text-[#1b1c1c]">350+</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-[#6d6a66]" />
                  <div>
                    <p className="text-xs font-semibold text-[#6d6a66]">RESPONSE TIME</p>
                    <p className="text-sm font-semibold text-[#1b1c1c]">
                      {m.hours_per_week ?? "< 24 Hours"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Location Card */}
            <Card>
              <p className="text-xs font-semibold uppercase tracking-wider text-[#6d6a66]">
                LOCATION
              </p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#1b1c1c]">
                  <MapPin className="h-4 w-4 text-[#6d6a66]" />
                  {m.location ?? "Lagos, Nigeria"}
                </div>
                <div className="flex items-center gap-2 text-sm text-[#6d6a66]">
                  <Globe2 className="h-4 w-4" />
                  GMT+1
                </div>
              </div>
            </Card>
          </div>

          {/* Right Content */}
          <div className="space-y-8">
            {/* Bio Section */}
            <section>
              <p className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.03em] text-[#1b1c1c]">
                Shaping the future of African cities through sustainable design.
              </p>
              <p className="mt-4 max-w-2xl text-lg leading-relaxed text-[#6d6a66]">
                {m.bio}
              </p>
            </section>

            {/* Areas of Expertise */}
            <section>
              <h2 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#6d6a66]">
                <span className="h-px w-8 bg-[#d4af37]" />
                Areas of Expertise
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {m.skills.slice(0, 3).map((skill, index) => {
                  const icons = [Compass, Code2, Landmark];
                  const Icon = icons[index % icons.length];
                  return (
                    <Card key={skill} className="p-5">
                      <Icon className="h-6 w-6 text-[#735c00]" />
                      <p className="mt-3 font-['Hanken_Grotesk'] text-lg font-semibold text-[#1b1c1c]">
                        {skill}
                      </p>
                      <p className="mt-1 text-sm text-[#6d6a66]">
                        {index === 0
                          ? "Master planning for high-density, resilient communities."
                          : index === 1
                            ? "Integrating passive cooling and local materials."
                            : "Translating cultural narratives into built forms."}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Mentorship Packages */}
            <section>
              <h2 className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-[#6d6a66]">
                <span className="h-px w-8 bg-[#d4af37]" />
                Mentorship Packages
              </h2>
              <div className="mt-4 grid gap-6 md:grid-cols-2">
                {packages.data && packages.data.length > 0 ? (
                  packages.data.map((pkg) => (
                    <Card
                      key={pkg.id}
                      className={cn(
                        "relative p-6",
                        pkg.is_popular && "border-[#d4af37]"
                      )}
                    >
                      {pkg.is_popular && (
                        <Badge className="absolute -top-3 right-6 bg-[#d4af37] text-[#1b1c1c]">
                          POPULAR
                        </Badge>
                      )}
                      <div className="flex items-start justify-between">
                        <p className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c]">
                          {pkg.title}
                        </p>
                        <span className="rounded-full bg-[#f5f3f3] px-3 py-1 text-sm font-semibold text-[#1b1c1c]">
                          ${pkg.price}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-[#6d6a66]">{pkg.description}</p>
                      <ul className="mt-4 space-y-2">
                        <li className="flex items-center gap-2 text-sm text-[#1b1c1c]">
                          <CheckCircle2 className="h-4 w-4 text-[#735c00]" />
                          {pkg.duration_minutes}-minute call
                        </li>
                        {pkg.session_count > 1 && (
                          <li className="flex items-center gap-2 text-sm text-[#1b1c1c]">
                            <CheckCircle2 className="h-4 w-4 text-[#735c00]" />
                            {pkg.session_count} sessions
                          </li>
                        )}
                      </ul>
                      <Button
                        href={`/mentorship/${mentorId}/request?package=${pkg.id}`}
                        variant={pkg.is_popular ? "secondary" : "outline"}
                        className={pkg.is_popular ? "mt-4 w-full text-white" : "mt-4 w-full"}
                      >
                        Select Package
                      </Button>
                    </Card>
                  ))
                ) : (
                  <p className="text-base text-[#6d6a66]">No packages available yet.</p>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}