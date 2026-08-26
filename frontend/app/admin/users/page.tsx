"use client";

import { useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { ProgressBar } from "@/components/ui/ProgressBar";

const STATUS_LABEL: Record<
  string,
  { label: string; tone: "success" | "warning" | "primary" | "neutral" }
> = {
  competency_verified: { label: "Competency Verified", tone: "success" },
  in_progress: { label: "In Progress", tone: "warning" },
  needs_review: { label: "Needs Review", tone: "primary" },
};

export default function AdminUsersPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  const learners = useAsync(
    () =>
      api.adminListLearners({ q: query || undefined, status_filter: status || undefined, page }),
    [query, status, page]
  );

  async function handleInvite() {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await api.adminInviteLearner(inviteEmail);
      setInviteEmail("");
    } finally {
      setInviting(false);
    }
  }

  const totalPages = learners.data ? Math.ceil(learners.data.total / learners.data.page_size) : 1;

  return (
    <div className="gap-lg flex flex-col">
      <div>
        <h1 className="text-headline-lg text-on-background">User Management</h1>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            placeholder="Search learners…"
            icon={<Search className="h-4 w-4" />}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="sm:w-48"
        >
          <option value="">All Statuses</option>
          <option value="competency_verified">Competency Verified</option>
          <option value="in_progress">In Progress</option>
          <option value="needs_review">Needs Review</option>
        </Select>
        <div className="flex gap-2">
          <Input
            placeholder="learner@email.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="sm:w-56"
          />
          <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>
            <Plus className="h-4 w-4" /> Invite Learner
          </Button>
        </div>
      </Card>

      <Card className="overflow-hidden p-0">
        {learners.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
        ) : learners.data && learners.data.results.length > 0 ? (
          <>
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
                <tr>
                  <th className="px-md py-3 font-normal">Learner</th>
                  <th className="px-md py-3 font-normal">Location</th>
                  <th className="px-md py-3 font-normal">Primary Track</th>
                  <th className="px-md py-3 font-normal">Progress</th>
                  <th className="px-md py-3 font-normal">Status</th>
                </tr>
              </thead>
              <tbody className="divide-outline-variant/40 divide-y">
                {learners.data.results.map((row) => (
                  <tr key={row.user_id}>
                    <td className="px-md py-4">
                      <div className="flex items-center gap-3">
                        <Avatar name={row.full_name} src={row.avatar_url} size={36} />
                        <div>
                          <p className="text-label-md text-on-background">{row.full_name}</p>
                          <p className="text-label-sm text-on-surface-variant">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md text-body-md text-on-surface py-4">
                      {row.location ?? "—"}
                    </td>
                    <td className="px-md text-body-md text-on-surface py-4">
                      {row.primary_track ?? "—"}
                    </td>
                    <td className="px-md py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24">
                          <ProgressBar value={row.progress_percent} />
                        </div>
                        <span className="text-label-sm text-on-surface-variant">
                          {row.progress_percent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-md py-4">
                      <Badge tone={STATUS_LABEL[row.status]?.tone ?? "neutral"} dot>
                        {STATUS_LABEL[row.status]?.label ?? row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-outline-variant/40 p-md flex items-center justify-between border-t">
              <p className="text-label-sm text-on-surface-variant">
                Showing {(page - 1) * learners.data.page_size + 1} to{" "}
                {Math.min(page * learners.data.page_size, learners.data.total)} of{" "}
                {learners.data.total} learners
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="border-outline-variant rounded-md border p-2 disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-label-sm text-on-surface-variant">
                  Page {page} of {totalPages || 1}
                </span>
                <button
                  onClick={() => setPage((p) => (p < totalPages ? p + 1 : p))}
                  disabled={page >= totalPages}
                  className="border-outline-variant rounded-md border p-2 disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className="p-md text-body-md text-on-surface-variant">No learners found.</p>
        )}
      </Card>
    </div>
  );
}
