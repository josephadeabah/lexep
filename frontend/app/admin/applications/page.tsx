"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "all", label: "All Applications" },
  { id: "pending", label: "Pending Only" },
  { id: "in_review", label: "In Review" },
] as const;

export default function MentorApplicationQueuePage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("all");
  const stats = useAsync(() => api.adminMentorApplicationStats(), []);
  const applications = useAsync(
    () => api.adminMentorApplications(tab === "all" ? undefined : tab),
    [tab]
  );

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">Mentor Application Queue</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">Review and manage incoming mentor requests.</p>
      </div>

      <div className="grid gap-md sm:grid-cols-3">
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <ClipboardList className="h-4 w-4 text-primary" /> TOTAL PENDING
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.total_pending ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <Clock className="h-4 w-4 text-primary" /> AVG. REVIEW TIME
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.avg_review_days ?? "—"} <span className="text-headline-md">days</span>
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <CheckCircle2 className="h-4 w-4 text-primary" /> NEW TODAY
          </div>
          <p className="mt-3 text-display-lg text-on-background" style={{ fontSize: 40, lineHeight: "48px" }}>
            {stats.data?.new_today ?? "—"}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center gap-2 border-b border-outline-variant/40 p-md">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-md px-4 py-2 text-label-md transition",
                tab === t.id
                  ? "bg-inverse-surface text-inverse-on-surface"
                  : "border border-outline-variant text-on-surface-variant hover:bg-surface-container-low"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {applications.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
        ) : applications.data && applications.data.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
              <tr>
                <th className="px-md py-3 font-normal">Applicant</th>
                <th className="px-md py-3 font-normal">Professional Title</th>
                <th className="px-md py-3 font-normal">Application Date</th>
                <th className="px-md py-3 font-normal">Credential Status</th>
                <th className="px-md py-3 font-normal">Status</th>
                <th className="px-md py-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/40">
              {applications.data.map((row) => (
                <tr key={row.user_id}>
                  <td className="px-md py-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={row.applicant_name} src={row.applicant_avatar} size={36} />
                      <div>
                        <p className="text-label-md text-on-background">{row.applicant_name}</p>
                        <p className="text-label-sm text-on-surface-variant">{row.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-md py-4 text-body-md text-on-surface">{row.professional_title}</td>
                  <td className="px-md py-4 text-body-md text-on-surface">
                    {row.application_date ? formatDate(row.application_date) : "—"}
                  </td>
                  <td className="px-md py-4">
                    <Badge tone={row.credential_status === "verified" ? "success" : "neutral"} dot>
                      {row.credential_status === "verified" ? "Verified" : "Awaiting Verification"}
                    </Badge>
                  </td>
                  <td className="px-md py-4">
                    <Badge tone={row.status === "in_review" ? "neutral" : "warning"} dot>
                      {row.status === "in_review" ? "In Review" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-md py-4 text-right">
                    <Button size="sm" variant={row.status === "in_review" ? "secondary" : "primary"} href={`/admin/applications/${row.user_id}`}>
                      {row.status === "in_review" ? "Continue Review" : "Review"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-md text-body-md text-on-surface-variant">No applications in this view.</p>
        )}
      </Card>
    </div>
  );
}
