"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal } from "lucide-react";
import { SharedShell } from "@/components/layout/SharedShell";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import { formatDate, cn } from "@/lib/utils";

function LeaderboardContent() {
  const [page, setPage] = useState(1);
  const leaderboard = useAsync(() => api.assessmentLeaderboard(undefined, page, 10), [page]);

  const items = leaderboard.data?.items ?? [];
  const top3 = items.slice(0, 3);
  const rest = items.slice(3);

  return (
    <div className="flex flex-col gap-lg">
      <Link href="/assessments" className="flex items-center gap-2 text-label-md text-on-surface-variant hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to Assessments
      </Link>

      <div>
        <h1 className="text-headline-lg text-on-background">Internship Assessment Leaderboard</h1>
        <p className="mt-1 text-body-md text-on-surface-variant">
          Ranking top candidates based on their performance in your company&apos;s internal assessments.
        </p>
      </div>

      {leaderboard.isLoading ? (
        <p className="text-body-md text-on-surface-variant">Loading…</p>
      ) : items.length > 0 ? (
        <>
          {top3.length > 0 && (
            <div className="grid gap-md sm:grid-cols-3">
              {top3.map((entry) => (
                <Card key={entry.rank} className={cn("text-center", entry.rank === 1 && "border-2 border-primary-container")}>
                  {entry.rank === 1 && <Trophy className="mx-auto h-6 w-6 text-primary-container" />}
                  {entry.rank !== 1 && <Medal className="mx-auto h-6 w-6 text-on-surface-variant" />}
                  <Avatar name={entry.candidate_name} src={entry.candidate_avatar} size={64} className="mx-auto mt-2" />
                  <p className="mt-3 text-headline-md text-on-background">{entry.candidate_name}</p>
                  <p className="text-label-sm text-on-surface-variant">{entry.assessment_title}</p>
                  <p className="mt-3 text-display-lg text-primary" style={{ fontSize: 36 }}>
                    {entry.score}%
                  </p>
                  <p className="text-label-sm text-on-surface-variant">Assessment Score</p>
                </Card>
              ))}
            </div>
          )}

          {rest.length > 0 && (
            <Card className="overflow-hidden p-0">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
                  <tr>
                    <th className="px-md py-3 font-normal">Rank</th>
                    <th className="px-md py-3 font-normal">Candidate</th>
                    <th className="px-md py-3 font-normal">Assessment</th>
                    <th className="px-md py-3 font-normal text-right">Score</th>
                    <th className="px-md py-3 font-normal text-right">Completed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/40">
                  {rest.map((entry) => (
                    <tr key={entry.rank}>
                      <td className="px-md py-4 text-body-md text-on-surface">{entry.rank}</td>
                      <td className="px-md py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={entry.candidate_name} src={entry.candidate_avatar} size={32} />
                          <p className="text-label-md text-on-background">{entry.candidate_name}</p>
                        </div>
                      </td>
                      <td className="px-md py-4 text-body-md text-on-surface">{entry.assessment_title}</td>
                      <td className="px-md py-4 text-right">
                        <Badge tone="primary">{entry.score}%</Badge>
                      </td>
                      <td className="px-md py-4 text-right text-label-sm text-on-surface-variant">
                        {entry.completed_at ? formatDate(entry.completed_at) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          <Pagination page={leaderboard.data!.page} totalPages={leaderboard.data!.total_pages} onPageChange={setPage} />
        </>
      ) : (
        <p className="text-body-md text-on-surface-variant">
          No completed attempts yet on your internal assessments. Create one from{" "}
          <Link href="/assessments/new" className="text-primary hover:underline">Assessments</Link>.
        </p>
      )}
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <SharedShell>
      <LeaderboardContent />
    </SharedShell>
  );
}
