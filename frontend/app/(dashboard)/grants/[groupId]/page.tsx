"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { GraduationCap, Share2, ArrowRight, Users } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Badge } from "@/components/ui/badge/Badge";
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

  if (group.isLoading) return <p className="text-base text-[#6d6a66]">Loading…</p>;
  const g = group.data;
  if (!g) return <p className="text-base text-[#ba1a1a]">Group not found.</p>;

  return (
    <div className="flex flex-col gap-8">
      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        {/* Left Content */}
        <div className="flex flex-col gap-6">
          {/* Main Group Card */}
          <Card className="overflow-hidden p-0">
            <div className="p-8">
              {/* Group Icon */}
              <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f7edc9]">
                <GraduationCap className="h-7 w-7 text-[#735c00]" />
              </span>

              <h1 className="mt-4 font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
                {g.name}
              </h1>
              <p className="mt-2 text-lg text-[#6d6a66]">{g.tagline}</p>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#6d6a66]">
                {g.description}
              </p>

              {/* Fundraising Progress */}
              <div className="mt-8 rounded-xl bg-[#f5f3f3] p-6">
                <div className="flex items-baseline justify-between">
                  <p className="font-['Hanken_Grotesk'] text-3xl font-bold text-[#1b1c1c]">
                    {formatCurrency(g.raised_amount)}
                  </p>
                  <p className="text-lg font-bold text-[#d4af37]">{g.percent_funded}%</p>
                </div>
                <p className="mt-1 text-sm text-[#6d6a66]">
                  raised of {formatCurrency(g.goal_amount)} goal
                </p>
                <ProgressBar value={g.percent_funded} className="mt-4" />
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <div className="flex flex-1 gap-2">
                  <Input
                    placeholder="Amount (USD)"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    icon={<span className="text-lg">$</span>}
                    className="h-12 rounded-lg border-[#e0d8c9] text-base"
                  />
                  <Button
                    onClick={handleContribute}
                    disabled={isContributing || !amount}
                    className="h-12 rounded-lg bg-[#d4af37] px-6 font-semibold"
                  >
                    {isContributing ? "Processing…" : "Contribute Now"}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
                <Button variant="outline" className="h-12 rounded-lg border-[#e0d8c9] px-6">
                  <Share2 className="h-4 w-4" /> Share Group
                </Button>
              </div>
            </div>
          </Card>

          {/* Top Contributors */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold tracking-[-0.02em] text-[#1b1c1c]">
                Top Contributors
              </h2>
              <button className="text-sm font-semibold text-[#735c00] hover:underline">
                View All
              </button>
            </div>

            <Card className="p-0">
              {contributors.isLoading ? (
                <p className="p-6 text-base text-[#6d6a66]">Loading…</p>
              ) : contributors.data && contributors.data.length > 0 ? (
                <ul className="divide-y divide-[#e0d8c9]">
                  {contributors.data.map((c, i) => (
                    <li key={c.id} className="flex items-center justify-between px-6 py-4">
                      <div className="flex items-center gap-4">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f3f3] text-sm font-bold text-[#6d6a66]">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-base font-semibold text-[#1b1c1c]">
                            {c.contributor_name}
                          </p>
                          <p className="text-sm text-[#6d6a66]">{formatDate(c.created_at)}</p>
                        </div>
                      </div>
                      <p className="font-['Hanken_Grotesk'] text-xl font-bold text-[#1b1c1c]">
                        {formatCurrency(c.amount)}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="p-6 text-base text-[#6d6a66]">No contributions yet — be the first!</p>
              )}
            </Card>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="flex flex-col gap-6">
          {/* Youth Sponsored Card */}
          <Card className="flex flex-col items-center justify-center bg-[#1b1c1c] p-8 text-center text-white">
            <GraduationCap className="h-10 w-10 text-[#d4af37]" />
            <p className="mt-4 font-['Hanken_Grotesk'] text-5xl font-bold text-[#d4af37]">
              {g.youth_sponsored}
            </p>
            <p className="mt-2 text-sm font-semibold tracking-wider text-[#c9c7c6] uppercase">
              Youth Sponsored
            </p>
          </Card>

          {/* Organized By */}
          <Card>
            <p className="text-sm font-semibold text-[#6d6a66]">ORGANIZED BY</p>
            <div className="mt-3 flex items-center gap-3">
              <Avatar name="Sarah Odenigbo" size={48} />
              <div>
                <p className="text-base font-semibold text-[#1b1c1c]">Sarah Odenigbo</p>
                <p className="text-sm text-[#6d6a66]">VP Engineering, GlobalTech</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Youth Impacted Section */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold tracking-[-0.02em] text-[#1b1c1c]">
            Youth Impacted
          </h2>
          <div className="flex gap-2">
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e0d8c9] hover:bg-[#f5f3f3]">
              <ArrowRight className="h-4 w-4 rotate-180 text-[#6d6a66]" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-[#e0d8c9] hover:bg-[#f5f3f3]">
              <ArrowRight className="h-4 w-4 text-[#6d6a66]" />
            </button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {/* Impact Card 1 */}
          <Card className="overflow-hidden p-0">
            <div className="relative h-48 bg-[#f5f3f3]">
              <img
                src="/images/mentorship.jpg"
                alt="Samuel O."
                className="h-full w-full object-cover"
              />
              <Badge className="absolute bottom-4 left-4 bg-[#d4af37] text-[#1b1c1c]">
                Frontend Path
              </Badge>
            </div>
            <div className="p-6">
              <p className="text-base font-semibold text-[#1b1c1c]">Samuel O.</p>
              <p className="text-sm text-[#6d6a66]">Lagos, Nigeria</p>
              <p className="mt-3 text-sm text-[#6d6a66] italic">
                "The grant provided me with a MacBook Pro, allowing me..."
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-[#6d6a66]">
                  <span>Course Progress</span>
                  <span className="font-semibold text-[#1b1c1c]">75%</span>
                </div>
                <ProgressBar value={75} className="mt-2" />
              </div>
            </div>
          </Card>

          {/* Impact Card 2 */}
          <Card className="overflow-hidden p-0">
            <div className="relative h-48 bg-[#f5f3f3]">
              <img src="/images/grants.jpg" alt="Joy M." className="h-full w-full object-cover" />
              <Badge className="absolute bottom-4 left-4 bg-[#d4af37] text-[#1b1c1c]">
                Data Science
              </Badge>
            </div>
            <div className="p-6">
              <p className="text-base font-semibold text-[#1b1c1c]">Joy M.</p>
              <p className="text-sm text-[#6d6a66]">Nairobi, Kenya</p>
              <p className="mt-3 text-sm text-[#6d6a66] italic">
                "Access to cloud computing credits through this group h..."
              </p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-[#6d6a66]">
                  <span>Course Progress</span>
                  <span className="font-semibold text-[#1b1c1c]">40%</span>
                </div>
                <ProgressBar value={40} className="mt-2" />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
