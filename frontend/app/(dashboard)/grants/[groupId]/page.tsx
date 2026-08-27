"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { GraduationCap, Share2, ArrowRight } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function GrantGroupDetailPage() {
  const params = useParams<{ groupId: string }>();
  const groupId = Number(params.groupId);

  const group = useAsync(() => api.getGrantGroup(groupId), [groupId]);
  const contributors = useAsync(() => api.topContributors(groupId), [groupId]);

  const [amount, setAmount] = useState("");
  const [isContributing, setIsContributing] = useState(false);

  async function handleContribute() {
    if (!amount) return;
    setIsContributing(true);
    try {
      const checkout = await api.checkoutContribution(groupId, Number(amount));
      if (checkout.authorization_url) {
        window.location.href = checkout.authorization_url;
        return;
      }
      // Mock provider (PAYMENTS_ENABLED=false): verify immediately, no redirect needed.
      await api.verifyPayment(checkout.reference);
      setAmount("");
      group.refetch();
      contributors.refetch();
    } finally {
      setIsContributing(false);
    }
  }

  if (group.isLoading) return <p className="text-body-md text-on-surface-variant">Loading…</p>;
  const g = group.data;
  if (!g) return <p className="text-body-md text-error">Group not found.</p>;

  return (
    <div className="gap-md grid lg:grid-cols-[1fr_320px]">
      <div className="gap-md flex flex-col">
        <Card>
          <span className="bg-primary-fixed flex h-12 w-12 items-center justify-center rounded-md">
            <GraduationCap className="text-on-primary-fixed-variant h-6 w-6" />
          </span>
          <h1 className="text-headline-lg text-on-background mt-4">{g.name}</h1>
          <p className="text-body-md text-on-surface-variant mt-1">{g.tagline}</p>
          <p className="text-body-md text-on-surface-variant mt-4">{g.description}</p>

          <div className="mt-md bg-surface-container-low p-md rounded-md">
            <div className="flex items-baseline justify-between">
              <p className="text-headline-md text-on-background">
                {formatCurrency(g.raised_amount)}
              </p>
              <p className="text-label-md text-primary">{g.percent_funded}%</p>
            </div>
            <p className="text-label-sm text-on-surface-variant">
              raised of {formatCurrency(g.goal_amount)} goal
            </p>
            <ProgressBar value={g.percent_funded} className="mt-3" />
          </div>

          <div className="mt-md flex flex-col gap-3 sm:flex-row">
            <div className="flex flex-1 gap-2">
              <Input
                placeholder="Amount (USD)"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                icon={<span className="text-body-md">$</span>}
              />
              <Button onClick={handleContribute} disabled={isContributing || !amount}>
                {isContributing ? "…" : "Contribute"} <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost">
              <Share2 className="h-4 w-4" /> Share Group
            </Button>
          </div>
        </Card>

        <Card>
          <h2 className="text-headline-md text-on-background">Top Contributors</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {contributors.isLoading ? (
              <p className="text-body-md text-on-surface-variant">Loading…</p>
            ) : contributors.data && contributors.data.length > 0 ? (
              contributors.data.map((c, i) => (
                <li key={c.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-surface-container-high text-label-sm flex h-8 w-8 items-center justify-center rounded-full">
                      {i + 1}
                    </span>
                    <div>
                      <p className="text-label-md text-on-background">{c.contributor_name}</p>
                      <p className="text-label-sm text-on-surface-variant">
                        {formatDate(c.created_at)}
                      </p>
                    </div>
                  </div>
                  <p className="text-label-md text-on-background">{formatCurrency(c.amount)}</p>
                </li>
              ))
            ) : (
              <p className="text-body-md text-on-surface-variant">
                No contributions yet — be the first!
              </p>
            )}
          </ul>
        </Card>
      </div>

      <div>
        <Card>
          <p className="text-label-sm text-on-surface-variant">Organized by</p>
          <div className="mt-2 flex items-center gap-3">
            <Avatar name="Organizer" size={44} />
            <div>
              <p className="text-label-md text-on-background">Group Organizer</p>
              <p className="text-label-sm text-on-surface-variant">{g.category}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
