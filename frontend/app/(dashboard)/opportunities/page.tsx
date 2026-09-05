"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Clock, Wallet, Bookmark, Sparkles } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { Opportunity } from "@/lib/types";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "error"> = {
  applied: "neutral",
  under_review: "warning",
  interview_scheduled: "primary" as never,
  accepted: "success",
  declined: "error",
};

function OpportunityCard({ o }: { o: Opportunity }) {
  return (
    <Card className="flex flex-col justify-between">
      <div>
        <div className="mb-3 flex items-start justify-between">
          <Badge tone="neutral">{o.category ?? "General"}</Badge>
          <Bookmark className="h-4 w-4 text-outline" />
        </div>
        <p className="text-headline-md text-on-background">{o.title}</p>
        <p className="text-body-md text-on-surface-variant">{o.company_name}</p>
        <div className="mt-3 flex flex-col gap-1 text-label-sm text-on-surface-variant">
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
            {o.stipend_provided ? `Paid${o.stipend_amount ? ` (${o.stipend_currency} ${o.stipend_amount}/mo)` : ""}` : "Unpaid"}
          </span>
        </div>
      </div>
      <Button href={`/opportunities/${o.id}`} variant="ghost" className="mt-4">
        View Details
      </Button>
    </Card>
  );
}

function LearnerOpportunities() {
  const [tab, setTab] = useState<"browse" | "applications">("browse");
  const [query, setQuery] = useState("");
  const opportunities = useAsync(() => api.listOpportunities(false, true), []);
  const applications = useAsync(() => api.myApplications(), []);
  const recommended = useAsync(() => api.recommendedOpportunities(), []);

  const filtered = (opportunities.data ?? []).filter((o) =>
    `${o.title} ${o.company_name ?? ""} ${o.category ?? ""}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-background">Find Your Next Opportunity</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Discover premium internships tailored for the next generation of African leaders.
          </p>
        </div>
      </div>

      {tab === "browse" && recommended.data && recommended.data.length > 0 && (
        <div>
          <p className="mb-3 flex items-center gap-2 text-headline-md text-on-background">
            <Sparkles className="h-4 w-4 text-primary" /> Recommended for You
          </p>
          <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {recommended.data.slice(0, 3).map((o) => (
              <OpportunityCard key={o.id} o={o} />
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-lg border-b border-outline-variant/40">
        {(["browse", "applications"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "border-b-2 px-1 pb-3 text-label-md capitalize transition",
              tab === t ? "border-primary-container text-on-background" : "border-transparent text-on-surface-variant"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "browse" ? (
        <>
          <Card className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <Input
                label="Search"
                placeholder="Keywords, job title, company…"
                icon={<Search className="h-4 w-4" />}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </Card>

          <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
            {opportunities.isLoading ? (
              <p className="text-body-md text-on-surface-variant">Loading opportunities…</p>
            ) : filtered.length > 0 ? (
              filtered.map((o) => <OpportunityCard key={o.id} o={o} />)
            ) : (
              <p className="text-body-md text-on-surface-variant">No opportunities match your search yet.</p>
            )}
          </div>
        </>
      ) : (
        <Card className="overflow-hidden p-0">
          {applications.isLoading ? (
            <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
          ) : applications.data && applications.data.length > 0 ? (
            <ul className="divide-y divide-outline-variant/40">
              {applications.data.map((app) => (
                <li key={app.id} className="flex items-center justify-between p-md">
                  <div>
                    <p className="text-label-md text-on-background">{app.opportunity_title}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {app.company_name} {app.location && `· ${app.location}`}
                    </p>
                    <p className="mt-1 text-label-sm text-on-surface-variant">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
                  </div>
                  <Badge tone={STATUS_TONE[app.status] ?? "neutral"} dot>
                    {app.status.replace("_", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-md text-body-md text-on-surface-variant">You haven&apos;t applied to anything yet.</p>
          )}
        </Card>
      )}
    </div>
  );
}

function CompanyOpportunities() {
  const opportunities = useAsync(() => api.listOpportunities(true), []);

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-background">Opportunities</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">Manage your open roles and review applicants.</p>
        </div>
        <Button href="/opportunities/new">+ New Application</Button>
      </div>

      <div className="grid gap-md sm:grid-cols-2 lg:grid-cols-3">
        {opportunities.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading…</p>
        ) : opportunities.data && opportunities.data.length > 0 ? (
          opportunities.data.map((o) => (
            <Card key={o.id}>
              <div className="mb-2 flex items-center justify-between">
                <Badge tone={o.status === "published" ? "success" : "neutral"} dot>
                  {o.status}
                </Badge>
                <span className="text-label-sm text-on-surface-variant capitalize">{o.work_mode}</span>
              </div>
              <p className="text-headline-md text-on-background">{o.title}</p>
              <p className="text-body-md text-on-surface-variant">{o.location}</p>
              <Link href={`/opportunities/${o.id}`} className="mt-4 inline-block text-label-md text-primary hover:underline">
                Review Applicants →
              </Link>
            </Card>
          ))
        ) : (
          <p className="text-body-md text-on-surface-variant">No opportunities posted yet.</p>
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
