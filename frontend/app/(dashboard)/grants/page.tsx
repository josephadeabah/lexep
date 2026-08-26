"use client";

import Link from "next/link";
import { GraduationCap, Landmark, ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatCurrency } from "@/lib/utils";

export default function GrantsPage() {
  const user = useAuthStore((s) => s.user);
  const groups = useAsync(() => api.listGrantGroups(), []);

  const totalYouth = (groups.data ?? []).reduce((sum, g) => sum + g.youth_sponsored, 0);
  const totalRaised = (groups.data ?? []).reduce((sum, g) => sum + g.raised_amount, 0);

  return (
    <div className="gap-lg flex flex-col">
      <div>
        <h1 className="text-headline-lg text-on-background">
          Welcome back, {user?.full_name.split(" ")[0]}
        </h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Here is the latest impact from your community funding initiatives.
        </p>
      </div>

      <div className="gap-md grid sm:grid-cols-3">
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant">Total Youth Sponsored</span>
            <GraduationCap className="text-primary h-4 w-4" />
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {totalYouth.toLocaleString()}
          </p>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface-variant">Total Grants Issued</span>
            <Landmark className="text-primary h-4 w-4" />
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {formatCurrency(totalRaised)}
          </p>
          <p className="text-label-sm text-on-surface-variant mt-1">
            Across {groups.data?.length ?? 0} active groups
          </p>
        </Card>
        <Card className="bg-inverse-surface text-inverse-on-surface">
          <p className="text-label-md">Start a new initiative</p>
          <p className="text-label-sm mt-2 text-[#c9c7c6]">
            Empower more youth by starting a dedicated funding group.
          </p>
          <Link
            href="/grants/new"
            className="text-label-md text-primary-fixed-dim mt-4 inline-flex items-center gap-1 hover:underline"
          >
            Get Started <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-headline-md text-on-background">Featured Opportunities</h2>
          <Button href="/grants/apply" variant="ghost" size="sm">
            Apply for an individual grant
          </Button>
        </div>
        <div className="gap-md grid sm:grid-cols-2 lg:grid-cols-3">
          {groups.isLoading ? (
            <p className="text-body-md text-on-surface-variant">Loading…</p>
          ) : groups.data && groups.data.length > 0 ? (
            groups.data.map((group) => (
              <Card key={group.id}>
                <p className="text-headline-md text-on-background">{group.name}</p>
                <p className="text-body-md text-on-surface-variant mt-1">{group.tagline}</p>
                <div className="mt-4">
                  <div className="text-label-sm text-on-surface-variant flex items-center justify-between">
                    <span>Funding Goal</span>
                    <span>
                      {formatCurrency(group.raised_amount)} / {formatCurrency(group.goal_amount)}
                    </span>
                  </div>
                  <ProgressBar value={group.percent_funded} className="mt-2" />
                </div>
                <Button href={`/grants/${group.id}`} variant="ghost" className="mt-4 w-full">
                  View Group
                </Button>
              </Card>
            ))
          ) : (
            <p className="text-body-md text-on-surface-variant">
              No funding groups yet.{" "}
              <Link href="/grants/new" className="text-primary hover:underline">
                Create one →
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
