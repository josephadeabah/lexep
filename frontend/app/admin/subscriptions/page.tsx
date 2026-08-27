"use client";

import { CreditCard, Users, UserMinus, Download } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";

const PLAN_LABEL: Record<string, string> = {
  learner_plus: "Learner Plus",
  mentor_pro: "Pro Learner",
  enterprise: "Enterprise",
};

export default function AdminSubscriptionsPage() {
  const subs = useAsync(() => api.adminSubscriptions(), []);

  return (
    <div className="gap-lg flex flex-col">
      <div>
        <h1 className="text-headline-lg text-on-background">Subscription Metrics</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Real-time overview of premium plan performance and user retention.
        </p>
      </div>

      <div className="gap-md grid sm:grid-cols-3">
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <CreditCard className="text-primary h-4 w-4" /> MONTHLY RECURRING REV
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {formatCurrency(subs.data?.monthly_recurring_revenue ?? 0)}
          </p>
        </Card>
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <Users className="text-primary h-4 w-4" /> ACTIVE PREMIUM USERS
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {subs.data?.active_premium_users ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <UserMinus className="text-primary h-4 w-4" /> AVG CHURN RATE
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {subs.data?.avg_churn_rate ?? "—"}%
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-outline-variant/40 p-md flex items-center justify-between border-b">
          <h2 className="text-headline-md text-on-background">Recent Premium Subscriptions</h2>
          <Button variant="ghost" size="sm">
            <Download className="h-3.5 w-3.5" /> Export CSV
          </Button>
        </div>
        {subs.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
        ) : subs.data && subs.data.recent_subscriptions.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
              <tr>
                <th className="px-md py-3 font-normal">User / Company</th>
                <th className="px-md py-3 font-normal">Plan Type</th>
                <th className="px-md py-3 font-normal">Amount</th>
                <th className="px-md py-3 font-normal">Renewal Date</th>
                <th className="px-md py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant/40 divide-y">
              {subs.data.recent_subscriptions.map((s) => (
                <tr key={s.id}>
                  <td className="px-md py-4">
                    <p className="text-label-md text-on-background">{s.user_name}</p>
                    <p className="text-label-sm text-on-surface-variant">{s.user_email}</p>
                  </td>
                  <td className="px-md py-4">
                    <Badge tone={s.plan === "enterprise" ? "primary" : "neutral"}>
                      {PLAN_LABEL[s.plan] ?? s.plan}
                    </Badge>
                  </td>
                  <td className="px-md text-body-md text-on-surface py-4">
                    {formatCurrency(s.amount)}/{s.billing_cycle === "annual" ? "yr" : "mo"}
                  </td>
                  <td className="px-md text-body-md text-on-surface py-4">
                    {s.renews_at ? formatDate(s.renews_at) : "—"}
                  </td>
                  <td className="px-md py-4">
                    <Badge
                      tone={
                        s.status === "active"
                          ? "success"
                          : s.status === "past_due"
                            ? "error"
                            : "neutral"
                      }
                    >
                      {s.status === "past_due"
                        ? "Past Due"
                        : s.status === "active"
                          ? "Active"
                          : s.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-md text-body-md text-on-surface-variant">No subscriptions yet.</p>
        )}
      </Card>
    </div>
  );
}
