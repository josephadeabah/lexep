"use client";

import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";

export default function MentorRequestsPage() {
  const requests = useAsync(() => api.myMentorRequests(), []);

  async function accept(id: number) {
    await api.acceptMentorshipRequest(id);
    requests.refetch();
  }

  async function decline(id: number) {
    await api.declineMentorshipRequest(id);
    requests.refetch();
  }

  return (
    <div className="gap-lg flex flex-col">
      <div>
        <h1 className="text-headline-lg text-on-background">Pending Requests</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Review and respond to new mentorship requests.
        </p>
      </div>

      <Card className="overflow-hidden p-0">
        {requests.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
        ) : requests.data && requests.data.length > 0 ? (
          <ul className="divide-outline-variant/40 divide-y">
            {requests.data.map((r) => (
              <li key={r.id} className="p-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Avatar name={r.learner_name ?? "Learner"} size={44} />
                  <div>
                    <p className="text-label-md text-on-background">{r.learner_name}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {r.session_type ?? "Mentorship session"} · Requested{" "}
                      {formatDate(r.created_at)}
                    </p>
                    {r.message && (
                      <p className="text-body-md text-on-surface-variant mt-1">
                        &ldquo;{r.message}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => decline(r.id)}>
                    Decline
                  </Button>
                  <Button size="sm" onClick={() => accept(r.id)}>
                    Accept
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-md text-body-md text-on-surface-variant">
            No pending requests right now.
          </p>
        )}
      </Card>
    </div>
  );
}
