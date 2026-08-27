"use client";

import { useState } from "react";
import { ClipboardList, Clock, CheckCircle2 } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/avatar/Avatar";
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
    <div className="gap-lg flex flex-col">
      <div>
        <h1 className="text-headline-lg text-on-background">Mentor Application Queue</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Review and manage incoming mentor requests.
        </p>
      </div>

      <div className="gap-md grid sm:grid-cols-3">
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <ClipboardList className="text-primary h-4 w-4" /> TOTAL PENDING
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {stats.data?.total_pending ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <Clock className="text-primary h-4 w-4" /> AVG. REVIEW TIME
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {stats.data?.avg_review_days ?? "—"} <span className="text-headline-md">days</span>
          </p>
        </Card>
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <CheckCircle2 className="text-primary h-4 w-4" /> NEW TODAY
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {stats.data?.new_today ?? "—"}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-outline-variant/40 p-md flex items-center gap-2 border-b">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "text-label-md rounded-md px-4 py-2 transition",
                tab === t.id
                  ? "bg-inverse-surface text-inverse-on-surface"
                  : "border-outline-variant text-on-surface-variant hover:bg-surface-container-low border"
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
                <th className="px-md py-3 text-right font-normal">Action</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant/40 divide-y">
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
                  <td className="px-md text-body-md text-on-surface py-4">
                    {row.professional_title}
                  </td>
                  <td className="px-md text-body-md text-on-surface py-4">
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
                    <Button
                      size="sm"
                      variant={row.status === "in_review" ? "secondary" : "primary"}
                      href={`/admin/applications/${row.user_id}`}
                    >
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
