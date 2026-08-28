"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  MapPin,
  Clock,
  Wallet,
  Bookmark,
  Briefcase,
  Users,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "error"> = {
  applied: "neutral",
  under_review: "warning",
  interview_scheduled: "primary" as never,
  accepted: "success",
  declined: "error",
};

function LearnerOpportunities() {
  const [tab, setTab] = useState<"browse" | "applications">("browse");
  const [query, setQuery] = useState("");
  const opportunities = useAsync(() => api.listOpportunities(false, true), []);
  const applications = useAsync(() => api.myApplications(), []);

  const filtered = (opportunities.data ?? []).filter((o) =>
    `${o.title} ${o.company_name ?? ""} ${o.category ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-0 sm:py-0">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.045em] text-[#1b1c1c] sm:text-4xl">
            Find Your Next Opportunity
          </h1>
          <p className="mt-2 text-sm text-[#6d6a66] sm:text-base">
            Discover premium internships tailored for the next generation of African leaders.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-[#e0d8c9] sm:gap-6">
        {(["browse", "applications"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "pb-3 text-sm font-semibold capitalize transition",
              tab === t
                ? "border-b-2 border-[#d4af37] text-[#1b1c1c]"
                : "border-b-2 border-transparent text-[#6d6a66] hover:text-[#1b1c1c]"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "browse" ? (
        <>
          {/* Search */}
          <div className="flex items-center gap-4">
            <div className="w-full">
              <Input
                placeholder="Search opportunities..."
                icon={<Search className="h-4 w-4" />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-11 w-full rounded-lg border-[#e0d8c9] bg-white text-base sm:h-12"
              />
            </div>
          </div>

          {/* Opportunity Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {opportunities.isLoading ? (
              <p className="text-base text-[#6d6a66]">Loading opportunities…</p>
            ) : filtered.length > 0 ? (
              filtered.map((o) => (
                <Card key={o.id} className="flex flex-col p-5 sm:p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <Badge tone="neutral" className="bg-[#f5f3f3] text-[#6d6a66]">
                      {o.category ?? "General"}
                    </Badge>
                    <button className="text-[#6d6a66] hover:text-[#1b1c1c]">
                      <Bookmark className="h-4 w-4" />
                    </button>
                  </div>

                  <h3 className="font-['Hanken_Grotesk'] text-lg font-semibold tracking-[-0.02em] text-[#1b1c1c] sm:text-xl">
                    {o.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6d6a66]">{o.company_name}</p>

                  <div className="mt-4 flex flex-col gap-2 text-sm text-[#6d6a66]">
                    {o.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-3.5 w-3.5" /> {o.location}
                      </span>
                    )}
                    {o.duration && (
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" /> {o.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Wallet className="h-3.5 w-3.5" />
                      {o.stipend_provided
                        ? `Paid${o.stipend_amount ? ` (${o.stipend_currency} ${o.stipend_amount}/mo)` : ""}`
                        : "Unpaid"}
                    </span>
                  </div>

                  <Button href={`/opportunities/${o.id}`} variant="outline" className="mt-6 w-full">
                    View Details
                  </Button>
                </Card>
              ))
            ) : (
              <p className="text-base text-[#6d6a66]">No opportunities match your search yet.</p>
            )}
          </div>
        </>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="border-b border-[#e0d8c9] bg-[#f5f3f3] px-5 py-4 sm:px-6">
            <h2 className="font-['Hanken_Grotesk'] text-lg font-semibold text-[#1b1c1c]">
              Your Applications
            </h2>
          </div>
          {applications.isLoading ? (
            <p className="p-5 text-base text-[#6d6a66] sm:p-6">Loading…</p>
          ) : applications.data && applications.data.length > 0 ? (
            <ul className="divide-y divide-[#e0d8c9]">
              {applications.data.map((app) => (
                <li
                  key={app.id}
                  className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div>
                    <p className="text-base font-semibold text-[#1b1c1c]">
                      {app.opportunity_title}
                    </p>
                    <p className="text-sm text-[#6d6a66]">
                      {app.company_name} {app.location && `· ${app.location}`}
                    </p>
                    <p className="mt-1 text-xs text-[#6d6a66]">
                      Applied: {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge tone={STATUS_TONE[app.status] ?? "neutral"} dot>
                    {app.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-5 text-base text-[#6d6a66] sm:p-6">
              You haven&apos;t applied to anything yet.
            </p>
          )}
        </Card>
      )}
    </div>
  );
}

function CompanyOpportunities() {
  const opportunities = useAsync(() => api.listOpportunities(true), []);

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-0 sm:py-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.045em] text-[#1b1c1c] sm:text-4xl">
            Opportunities
          </h1>
          <p className="mt-2 text-sm text-[#6d6a66] sm:text-base">
            Manage your open roles and review applicants.
          </p>
        </div>
        <Button
          href="/opportunities/new"
          className="h-11 rounded-md bg-[#d4af37] px-4 font-semibold text-[#1b1c1c] hover:bg-[#c9a32e] sm:h-12 sm:px-6"
        >
          + New Application
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {opportunities.isLoading ? (
          <p className="text-base text-[#6d6a66]">Loading…</p>
        ) : opportunities.data && opportunities.data.length > 0 ? (
          opportunities.data.map((o) => (
            <Card key={o.id} className="p-5 sm:p-6">
              <div className="mb-4 flex items-center justify-between">
                <Badge
                  tone={o.status === "published" ? "success" : "neutral"}
                  dot
                  className={
                    o.status === "published"
                      ? "bg-[#dcefe1] text-[#276b3b]"
                      : "bg-[#f5f3f3] text-[#6d6a66]"
                  }
                >
                  {o.status}
                </Badge>
                <span className="text-xs text-[#6d6a66] capitalize">{o.work_mode}</span>
              </div>

              <h3 className="font-['Hanken_Grotesk'] text-lg font-semibold tracking-[-0.02em] text-[#1b1c1c] sm:text-xl">
                {o.title}
              </h3>
              <p className="mt-1 text-sm text-[#6d6a66]">{o.location}</p>

              <div className="mt-4 flex items-center gap-4 border-t border-[#e0d8c9]/40 pt-4">
                <span className="flex items-center gap-2 text-sm text-[#6d6a66]">
                  <Briefcase className="h-3.5 w-3.5" />
                  {o.work_mode}
                </span>
                <Link
                  href={`/opportunities/${o.id}`}
                  className="ml-auto flex items-center gap-1 text-sm font-semibold text-[#735c00] hover:underline"
                >
                  Review <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </Card>
          ))
        ) : (
          <p className="text-base text-[#6d6a66]">No opportunities posted yet.</p>
        )}
      </div>
    </div>
  );
}

export default function OpportunitiesPage() {
  const role = useAuthStore((s) => s.user?.role);
  if (role === "company") return <CompanyOpportunities />;
  return <LearnerOpportunities />;
}
