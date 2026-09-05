// app/applications/page.tsx
"use client";

import { DashboardShell } from "@/components/layout/DashboardShell";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const STATUS_TONE: Record<string, "neutral" | "success" | "warning" | "error"> = {
  applied: "neutral",
  under_review: "warning",
  interview_scheduled: "primary" as never,
  accepted: "success",
  declined: "error",
};

function MyApplicationsContent() {
  const applications = useAsync(() => api.myApplications(), []);

  return (
    <div className="flex flex-col gap-lg">
      <div>
        <h1 className="text-headline-lg text-on-background">My Applications</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Track the status of all your internship and opportunity applications.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        {applications.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading your applications…</p>
        ) : applications.data && applications.data.length > 0 ? (
          <ul className="divide-y divide-outline-variant/40">
            {applications.data.map((app) => (
              <li key={app.id} className="flex items-center justify-between p-md">
                <div>
                  <p className="text-label-md text-on-background">{app.opportunity_title}</p>
                  <p className="text-label-sm text-on-surface-variant">
                    {app.company_name} {app.location && `· ${app.location}`}
                  </p>
                  <p className="mt-1 text-label-sm text-on-surface-variant">
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
          <p className="p-md text-body-md text-on-surface-variant">
            You haven't applied to any opportunities yet.{" "}
            <a href="/opportunities" className="text-primary hover:underline">
              Browse opportunities →
            </a>
          </p>
        )}
      </Card>
    </div>
  );
}

export default function MyApplicationsPage() {
  return (
    <DashboardShell>
      <MyApplicationsContent />
    </DashboardShell>
  );
}