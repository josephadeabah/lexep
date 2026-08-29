"use client";

import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Badge } from "@/components/ui/badge/Badge";
import { formatDate, formatTime } from "@/lib/utils";
import { CalendarClock, MessageSquare } from "lucide-react";

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
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
          Pending Requests
        </h1>
        <p className="mt-2 text-base text-[#6d6a66]">
          Review and respond to new mentorship requests.
        </p>
      </div>

      {/* Requests List */}
      <Card className="overflow-hidden p-0">
        {requests.isLoading ? (
          <p className="p-6 text-base text-[#6d6a66]">Loading…</p>
        ) : requests.data && requests.data.length > 0 ? (
          <ul className="divide-y divide-[#e0d8c9]/40">
            {requests.data.map((r) => (
              <li key={r.id} className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                {/* Learner Info */}
                <div className="flex items-start gap-4">
                  <Avatar
                    name={r.learner_name ?? "Learner"}
                    size={48}
                    className="rounded-full"
                  />
                  <div>
                    <p className="text-base font-semibold text-[#1b1c1c]">
                      {r.learner_name}
                    </p>
                    <p className="mt-1 flex items-center gap-2 text-sm text-[#6d6a66]">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {r.session_type ?? "Mentorship session"} · Requested{" "}
                      {formatDate(r.created_at)}
                    </p>

                    {/* Message */}
                    {r.message && (
                      <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#f5f3f3] p-3">
                        <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#735c00]" />
                        <p className="text-sm italic text-[#6d6a66]">
                          &ldquo;{r.message}&rdquo;
                        </p>
                      </div>
                    )}

                    {/* Proposed Times */}
                    {r.proposed_times.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {r.proposed_times.slice(0, 3).map((time, index) => (
                          <Badge
                            key={index}
                            className="bg-[#f5f3f3] text-[#6d6a66]"
                          >
                            {formatDate(time)}, {formatTime(time)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-shrink-0 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => decline(r.id)}
                    className="border-[#e0d8c9]"
                  >
                    Decline
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => accept(r.id)}
                    className="bg-[#d4af37] font-semibold"
                  >
                    Accept
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="p-6 text-base text-[#6d6a66]">
            No pending requests right now.
          </p>
        )}
      </Card>
    </div>
  );
}