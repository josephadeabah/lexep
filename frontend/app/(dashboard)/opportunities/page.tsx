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
  ChevronDown,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Select } from "@/components/ui/select/Select";
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
  const [tab, setTab] = useState<"browse" | "applications" | "saved">("browse");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [locationType, setLocationType] = useState("any");
  const opportunities = useAsync(() => api.listOpportunities(false, true), []);
  const applications = useAsync(() => api.myApplications(), []);

  const filtered = (opportunities.data ?? []).filter((o) => {
    const matchesQuery = `${o.title} ${o.company_name ?? ""} ${o.category ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesCategory =
      category === "all" || o.category?.toLowerCase() === category.toLowerCase();
    const matchesLocation = locationType === "any" || o.work_mode === locationType;
    return matchesQuery && matchesCategory && matchesLocation;
  });

  return (
    <div className="flex flex-col gap-6 px-4 py-6 sm:gap-8 sm:px-0 sm:py-0">
      {/* Page Header */}
      <div className="flex flex-col gap-2">
        <h2 className="font-['Hanken_Grotesk'] text-3xl font-bold tracking-[-0.045em] text-[#1b1c1c] sm:text-4xl">
          Find Your Next Opportunity
        </h2>
        <p className="mt-2 text-sm text-[#6d6a66] sm:text-base">
          Discover premium internships tailored for the next generation of African leaders and
          architects of the future.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 rounded-lg border border-[#e0d8c9] bg-white p-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">Search</label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#6d6a66]" />
            <input
              type="text"
              placeholder="Keywords, job title, company..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-md border border-[#e0d8c9] bg-white pr-4 pl-10 text-base transition outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
            />
          </div>
        </div>

        <div className="sm:w-48">
          <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-11 w-full appearance-none rounded-md border border-[#e0d8c9] bg-white px-4 pr-8 text-base transition outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
            >
              <option value="all">All Categories</option>
              <option value="technology">Technology</option>
              <option value="design">Design</option>
              <option value="engineering">Engineering</option>
              <option value="sustainability">Sustainability</option>
              <option value="business">Business</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#6d6a66]" />
          </div>
        </div>

        <div className="sm:w-48">
          <label className="mb-2 block text-sm font-semibold text-[#1b1c1c]">Location Type</label>
          <div className="relative">
            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="h-11 w-full appearance-none rounded-md border border-[#e0d8c9] bg-white px-4 pr-8 text-base transition outline-none focus:border-[#d4af37] focus:ring-2 focus:ring-[#d4af37]/20"
            >
              <option value="any">Any</option>
              <option value="remote">Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-site</option>
            </select>
            <ChevronDown className="pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-[#6d6a66]" />
          </div>
        </div>
      </div>

      {tab === "browse" ? (
        <>
          {/* Opportunity Cards Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.isLoading ? (
              <p className="text-base text-[#6d6a66]">Loading opportunities…</p>
            ) : filtered.length > 0 ? (
              filtered.map((o) => (
                <Card key={o.id} className="flex flex-col p-6">
                  {/* Header: Company Logo & Bookmark */}
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#f5f3f3]">
                      <span className="text-lg font-bold text-[#735c00]">
                        {o.company_name?.[0] ?? "?"}
                      </span>
                    </div>
                    <button className="text-[#6d6a66] hover:text-[#1b1c1c]">
                      <Bookmark className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Category */}
                  <Badge className="mb-3 w-fit bg-[#f5f3f3] text-[#6d6a66]">
                    {o.category ?? "General"}
                  </Badge>

                  {/* Title & Company */}
                  <h3 className="font-['Hanken_Grotesk'] text-xl font-semibold tracking-[-0.02em] text-[#1b1c1c]">
                    {o.title}
                  </h3>
                  <p className="mt-1 text-sm text-[#6d6a66]">{o.company_name}</p>

                  {/* Details */}
                  <div className="mt-5 flex flex-col gap-2.5 border-t border-[#e0d8c9]/40 pt-5 text-sm text-[#6d6a66]">
                    {o.location && (
                      <span className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" /> {o.location} ({o.work_mode})
                      </span>
                    )}
                    {o.duration && (
                      <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4" /> {o.duration}
                      </span>
                    )}
                    <span className="flex items-center gap-2">
                      <Wallet className="h-4 w-4" />
                      {o.stipend_provided
                        ? `Paid Stipend${o.stipend_amount ? ` (${o.stipend_currency} ${o.stipend_amount}/mo)` : ""}`
                        : "Unpaid (Academic Credit)"}
                    </span>
                  </div>

                  {/* Action */}
                  <Button
                    href={`/opportunities/${o.id}`}
                    variant="outline"
                    className="mt-6 w-full border-[#e0d8c9] text-[#1b1c1c] hover:bg-[#f5f3f3]"
                  >
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
          <div className="border-b border-[#e0d8c9] bg-[#f5f3f3] px-6 py-4">
            <h2 className="font-['Hanken_Grotesk'] text-lg font-semibold text-[#1b1c1c]">
              {tab === "applications" ? "Your Applications" : "Saved Opportunities"}
            </h2>
          </div>
          {applications.isLoading ? (
            <p className="p-6 text-base text-[#6d6a66]">Loading…</p>
          ) : applications.data && applications.data.length > 0 ? (
            <ul className="divide-y divide-[#e0d8c9]">
              {applications.data.map((app) => (
                <li
                  key={app.id}
                  className="flex flex-col gap-2 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
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
            <p className="p-6 text-base text-[#6d6a66]">
              {tab === "applications"
                ? "You haven't applied to anything yet."
                : "No saved opportunities yet."}
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

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {opportunities.isLoading ? (
          <p className="text-base text-[#6d6a66]">Loading…</p>
        ) : opportunities.data && opportunities.data.length > 0 ? (
          opportunities.data.map((o) => (
            <Card key={o.id} className="p-6">
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

              <h3 className="font-['Hanken_Grotesk'] text-xl font-semibold tracking-[-0.02em] text-[#1b1c1c]">
                {o.title}
              </h3>
              <p className="mt-1 text-sm text-[#6d6a66]">{o.location}</p>

              <div className="mt-5 flex items-center gap-4 border-t border-[#e0d8c9]/40 pt-5">
                <span className="flex items-center gap-2 text-sm text-[#6d6a66]">
                  <Briefcase className="h-4 w-4" />
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
