"use client";

import Link from "next/link";
import { GraduationCap, Landmark, ArrowRight, Users, TrendingUp } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/badge/Badge";
import { ProgressBar } from "@/components/ui/progress-bar/ProgressBar";
import { formatCurrency } from "@/lib/utils";

export default function GrantsPage() {
  const user = useAuthStore((s) => s.user);
  const groups = useAsync(() => api.listGrantGroups(), []);

  const totalYouth = (groups.data ?? []).reduce((sum, g) => sum + g.youth_sponsored, 0);
  const totalRaised = (groups.data ?? []).reduce((sum, g) => sum + g.raised_amount, 0);

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome Header */}
      <div>
        <h2 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
          Welcome back, {user?.full_name.split(" ")[0]}
        </h2>
        <p className="mt-1 text-base text-[#6d6a66]">
          Here is the latest impact from your community funding initiatives.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#6d6a66]">Total Youth Sponsored</span>
            <GraduationCap className="h-5 w-5 text-[#d4af37]" />
          </div>
          <p className="mt-3 font-['Hanken_Grotesk'] text-5xl font-bold text-[#1b1c1c]">
            {totalYouth.toLocaleString()}
          </p>
          <p className="mt-1 flex items-center gap-1 text-sm text-[#6d6a66]">
            <TrendingUp className="h-3.5 w-3.5 text-[#276b3b]" />
            +12% this quarter
          </p>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-[#6d6a66]">Total Grants Issued</span>
            <Landmark className="h-5 w-5 text-[#d4af37]" />
          </div>
          <p className="mt-3 font-['Hanken_Grotesk'] text-5xl font-bold text-[#1b1c1c]">
            {formatCurrency(totalRaised)}
          </p>
          <p className="mt-1 text-sm text-[#6d6a66]">
            Across {groups.data?.length ?? 0} active groups
          </p>
        </Card>

        <div className="rounded-lg border border-[#e0d8c9] bg-[#1b1c1c] p-6 text-white shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <p className="text-sm font-semibold">Start a new initiative</p>
          <p className="mt-2 text-sm text-[#c9c7c6]">
            Empower more youth by starting a dedicated funding group.
          </p>
          <Link
            href="/grants/new"
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#d4af37] hover:underline"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Featured Opportunities */}
      <div>
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold tracking-[-0.02em] text-[#1b1c1c]">
            Featured Opportunities
          </h2>
          <Button href="/grants/apply" variant="outline" size="sm">
            Apply for an individual grant
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.isLoading ? (
            <p className="text-base text-[#6d6a66]">Loading…</p>
          ) : groups.data && groups.data.length > 0 ? (
            groups.data.map((group) => (
              <Card key={group.id} className="flex flex-col p-6">
                <div className="mb-3 flex items-center justify-between">
                  <Badge className="bg-[#f5f3f3] text-[#6d6a66]">
                    {group.category ?? "General"}
                  </Badge>
                  <Users className="h-4 w-4 text-[#6d6a66]" />
                </div>

                <h3 className="font-['Hanken_Grotesk'] text-xl font-semibold tracking-[-0.02em] text-[#1b1c1c]">
                  {group.name}
                </h3>
                <p className="mt-1 flex-1 text-sm text-[#6d6a66]">{group.tagline}</p>

                <div className="mt-4">
                  <div className="flex items-center justify-between text-sm text-[#6d6a66]">
                    <span>Funding Goal</span>
                    <span className="font-semibold text-[#1b1c1c]">
                      {formatCurrency(group.raised_amount)} / {formatCurrency(group.goal_amount)}
                    </span>
                  </div>
                  <ProgressBar value={group.percent_funded} className="mt-2" />
                </div>

                <Button href={`/grants/${group.id}`} variant="outline" className="mt-4 w-full">
                  View Group
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-base text-[#6d6a66]">
              No funding groups yet.{" "}
              <Link href="/grants/new" className="text-[#735c00] hover:underline">
                Create one →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
