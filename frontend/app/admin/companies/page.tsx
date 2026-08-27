"use client";

import { useState } from "react";
import { Building2, ClipboardCheck, Briefcase, Download, Plus } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Badge } from "@/components/ui/badge/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";

const TIER_LABEL: Record<string, string> = { basic: "Basic", pro: "Pro", enterprise: "Enterprise" };

export default function AdminCompaniesPage() {
  const companies = useAsync(() => api.adminCompanies(), []);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviting, setInviting] = useState(false);

  async function handleInvite() {
    if (!inviteEmail) return;
    setInviting(true);
    try {
      await api.adminInviteCompany(inviteEmail);
      setInviteEmail("");
    } finally {
      setInviting(false);
    }
  }

  async function handleReview(userId: number) {
    await api.adminReviewCompany(userId, true);
    companies.refetch();
  }

  return (
    <div className="gap-lg flex flex-col">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-headline-lg text-on-background">Partner Firms Management</h1>
          <p className="text-body-md text-on-surface-variant mt-1">
            Manage corporate accounts, monitor onboarding, and track engagement metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost">
            <Download className="h-4 w-4" /> Export Data
          </Button>
        </div>
      </div>

      <Card className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Invite a company"
            placeholder="hiring@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </div>
        <Button onClick={handleInvite} disabled={inviting || !inviteEmail}>
          <Plus className="h-4 w-4" /> Invite Company
        </Button>
      </Card>

      <div className="gap-md grid sm:grid-cols-3">
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <Building2 className="text-primary h-4 w-4" /> Total Active Firms
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {companies.data?.total_active_firms ?? "—"}
          </p>
        </Card>
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <ClipboardCheck className="text-primary h-4 w-4" /> Pending Onboarding
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {companies.data?.pending_onboarding ?? "—"}
          </p>
          <p className="text-label-sm text-on-surface-variant mt-1">Requires admin review</p>
        </Card>
        <Card>
          <div className="text-label-sm text-on-surface-variant flex items-center gap-2">
            <Briefcase className="text-primary h-4 w-4" /> Total Interns Placed
          </div>
          <p
            className="text-display-lg text-on-background mt-3"
            style={{ fontSize: 40, lineHeight: "48px" }}
          >
            {companies.data?.total_interns_placed ?? "—"}
          </p>
        </Card>
      </div>

      <Card className="overflow-hidden p-0">
        <div className="border-outline-variant/40 p-md border-b">
          <h2 className="text-headline-md text-on-background">Company Roster</h2>
        </div>
        {companies.isLoading ? (
          <p className="p-md text-body-md text-on-surface-variant">Loading…</p>
        ) : companies.data && companies.data.companies.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-surface-container-low text-label-sm text-on-surface-variant">
              <tr>
                <th className="px-md py-3 font-normal">Company Name</th>
                <th className="px-md py-3 font-normal">Subscription Tier</th>
                <th className="px-md py-3 font-normal">Status</th>
                <th className="px-md py-3 text-right font-normal">Active Internships</th>
                <th className="px-md py-3 text-right font-normal">Total Hires</th>
                <th className="px-md py-3 text-right font-normal">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-outline-variant/40 divide-y">
              {companies.data.companies.map((c) => (
                <tr key={c.user_id}>
                  <td className="px-md py-4">
                    <p className="text-label-md text-on-background">{c.company_name}</p>
                    <p className="text-label-sm text-on-surface-variant">
                      {c.industry} {c.location && `· ${c.location}`}
                    </p>
                  </td>
                  <td className="px-md py-4">
                    <Badge tone={c.subscription_tier === "enterprise" ? "primary" : "neutral"}>
                      {TIER_LABEL[c.subscription_tier] ?? c.subscription_tier}
                    </Badge>
                  </td>
                  <td className="px-md py-4">
                    <Badge tone={c.onboarding_status === "active" ? "success" : "warning"} dot>
                      {c.onboarding_status === "active" ? "Active" : "Pending Review"}
                    </Badge>
                  </td>
                  <td className="px-md text-body-md text-on-surface py-4 text-right">
                    {c.active_internships}
                  </td>
                  <td className="px-md text-body-md text-on-surface py-4 text-right">
                    {c.total_hires}
                  </td>
                  <td className="px-md py-4 text-right">
                    {c.onboarding_status === "pending_review" && (
                      <button
                        onClick={() => handleReview(c.user_id)}
                        className="text-label-md text-primary hover:underline"
                      >
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="p-md text-body-md text-on-surface-variant">No partner firms yet.</p>
        )}
      </Card>
    </div>
  );
}
