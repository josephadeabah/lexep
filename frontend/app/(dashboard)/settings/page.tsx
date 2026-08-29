"use client";

import { useState } from "react";
import { User as UserIcon, Bell, Shield, Mail, Smartphone, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Input } from "@/components/ui/input/Input";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/checkbox/Checkbox";
import { Radio } from "@/components/ui/radio/Radio";
import { Avatar } from "@/components/ui/avatar/Avatar";

const TABS = [
  { id: "account", label: "Account Information", icon: UserIcon },
  { id: "notifications", label: "Notification Preferences", icon: Bell },
  { id: "privacy", label: "Privacy Settings", icon: Shield },
] as const;

type TabId = (typeof TABS)[number]["id"];

function AccountTab() {
  const user = useAuthStore((s) => s.user)!;
  const setUser = useAuthStore((s) => s.setUser);
  const [fullName, setFullName] = useState(user.full_name);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await api.updateAccount({ full_name: fullName });
      setUser(updated);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e0d8c9]/40 pb-4">
        <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
          Account Information
        </h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-sm font-semibold text-[#735c00] hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      {/* Avatar & Name */}
      <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <Avatar name={user.full_name} src={user.avatar_url} size={120} className="rounded-full" />
        <div className="w-full flex-1">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="First Name"
              value={fullName.split(" ")[0]}
              onChange={(e) => {
                const parts = fullName.split(" ");
                parts[0] = e.target.value;
                setFullName(parts.join(" "));
              }}
              disabled={!editing}
              className="h-12 rounded-lg border-[#e0d8c9]"
            />
            <Input
              label="Last Name"
              value={fullName.split(" ").slice(1).join(" ") || ""}
              onChange={(e) => {
                const parts = fullName.split(" ");
                parts[parts.length - 1] = e.target.value;
                setFullName(parts.join(" "));
              }}
              disabled={!editing}
              className="h-12 rounded-lg border-[#e0d8c9]"
            />
          </div>
        </div>
      </div>

      {/* Email */}
      <div className="mt-6">
        <Input
          label="Email Address"
          value={user.email}
          disabled
          className="h-12 rounded-lg border-[#e0d8c9]"
        />
      </div>

      {/* Password */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Password"
            type="password"
            value="•••••••••••"
            disabled
            className="h-12 rounded-lg border-[#e0d8c9] bg-[#f5f3f3]"
          />
        </div>
        <Button variant="outline" className="h-12 border-[#e0d8c9] font-semibold">
          Change Password
        </Button>
      </div>

      {/* Actions */}
      {editing && (
        <div className="mt-6 flex justify-end gap-2 border-t border-[#e0d8c9]/40 pt-4">
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving} className="bg-[#d4af37] font-semibold">
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      )}
    </Card>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState({
    new_internship_alerts: true,
    mentorship_requests: true,
    weekly_digests: false,
    interview_reminders: true,
    message_alerts: false,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateNotifications(prefs);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const EMAIL_OPTIONS: { key: keyof typeof prefs; label: string; description: string }[] = [
    {
      key: "new_internship_alerts",
      label: "New Internship Alerts",
      description: "Get notified when opportunities matching your profile are posted.",
    },
    {
      key: "mentorship_requests",
      label: "Mentorship Requests",
      description: "Receive an email when a mentor responds to your application.",
    },
    {
      key: "weekly_digests",
      label: "Weekly Digests",
      description: "A weekly summary of your progress and new resources.",
    },
  ];
  const PUSH_OPTIONS: { key: keyof typeof prefs; label: string; description: string }[] = [
    {
      key: "interview_reminders",
      label: "Interview Reminders",
      description: "Important alerts for upcoming scheduled interviews.",
    },
    {
      key: "message_alerts",
      label: "Message Alerts",
      description: "Instant notifications when you receive a direct message.",
    },
  ];

  function Toggle({ optKey }: { optKey: keyof typeof prefs }) {
    const on = prefs[optKey];
    return (
      <button
        onClick={() => setPrefs((p) => ({ ...p, [optKey]: !p[optKey] }))}
        className={cn(
          "flex h-7 w-12 flex-shrink-0 items-center rounded-full px-1 transition",
          on ? "justify-end bg-[#d4af37]" : "justify-start bg-[#e0d8c9]"
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
          {on && <Check className="h-3 w-3 text-[#735c00]" />}
        </span>
      </button>
    );
  }

  return (
    <Card className="p-8">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-[#e0d8c9]/40 pb-4">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f7edc9]">
          <Bell className="h-6 w-6 text-[#735c00]" />
        </span>
        <div>
          <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
            Notification Preferences
          </h2>
          <p className="text-sm text-[#6d6a66]">Control how and when you receive updates.</p>
        </div>
      </div>

      {/* Email Notifications */}
      <p className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-[#6d6a66] uppercase">
        <Mail className="h-4 w-4" /> Email Notifications
      </p>
      <div className="mt-2 flex flex-col divide-y divide-[#e0d8c9]/40">
        {EMAIL_OPTIONS.map((o) => (
          <div key={o.key} className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="block text-base font-semibold text-[#1b1c1c]">{o.label}</span>
              <span className="block text-sm text-[#6d6a66]">{o.description}</span>
            </span>
            <Toggle optKey={o.key} />
          </div>
        ))}
      </div>

      {/* Push Notifications */}
      <p className="mt-6 flex items-center gap-2 text-xs font-bold tracking-wider text-[#6d6a66] uppercase">
        <Smartphone className="h-4 w-4" /> Push Notifications
      </p>
      <div className="mt-2 flex flex-col divide-y divide-[#e0d8c9]/40">
        {PUSH_OPTIONS.map((o) => (
          <div key={o.key} className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="block text-base font-semibold text-[#1b1c1c]">{o.label}</span>
              <span className="block text-sm text-[#6d6a66]">{o.description}</span>
            </span>
            <Toggle optKey={o.key} />
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="mt-6 flex justify-end gap-2 border-t border-[#e0d8c9]/40 pt-4">
        <Button variant="outline" className="border-[#e0d8c9]">
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={saving} className="bg-[#d4af37] font-semibold">
          {saving ? "Saving…" : saved ? "Saved!" : "Save Changes"}
        </Button>
      </div>
    </Card>
  );
}

function PrivacyTab() {
  const [visibility, setVisibility] = useState<"public" | "mentors_only" | "private">("public");
  const [shareAnonymizedData, setShareAnonymizedData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await api.updatePrivacy({
        profile_visibility: visibility,
        share_anonymized_data: shareAnonymizedData,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  const VISIBILITY_OPTIONS: { id: typeof visibility; label: string; description: string }[] = [
    {
      id: "public",
      label: "Public",
      description: "Anyone in the Architect Portal can find and view your profile.",
    },
    {
      id: "mentors_only",
      label: "Mentors Only",
      description: "Only verified mentors and institutional partners can view your details.",
    },
    {
      id: "private",
      label: "Private",
      description: "Your profile is hidden from search and directories.",
    },
  ];

  return (
    <Card className="p-8">
      <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
        Profile Visibility
      </h2>
      <p className="mt-1 text-sm text-[#6d6a66]">
        Control who can see your profile and academic achievements within the network.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        {VISIBILITY_OPTIONS.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-start gap-3">
            <Radio checked={visibility === o.id} onChange={() => setVisibility(o.id)} />
            <span>
              <span className="block text-base font-semibold text-[#1b1c1c]">{o.label}</span>
              <span className="block text-sm text-[#6d6a66]">{o.description}</span>
            </span>
          </label>
        ))}
      </div>

      {/* Data Sharing */}
      <h2 className="mt-8 border-t border-[#e0d8c9]/40 pt-6 font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
        Data Sharing
      </h2>
      <p className="mt-1 text-sm text-[#6d6a66]">
        Manage how your data is used to improve our services and programs.
      </p>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg bg-[#f5f3f3] p-4">
        <Checkbox
          checked={shareAnonymizedData}
          onChange={(e) => setShareAnonymizedData(e.target.checked)}
        />
        <span>
          <span className="block text-base font-semibold text-[#1b1c1c]">
            Share anonymized data with educational partners
          </span>
          <span className="block text-sm text-[#6d6a66]">
            We use this data to secure more grants and opportunities for the community. Your
            personal identity remains hidden.
          </span>
        </span>
      </label>

      {/* Account Security */}
      <h2 className="mt-8 border-t border-[#e0d8c9]/40 pt-6 font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
        Account Security
      </h2>
      <p className="mt-1 text-sm text-[#6d6a66]">
        Enhance the protection of your professional account.
      </p>

      <div className="mt-4 flex items-center justify-between rounded-lg border border-[#e0d8c9] p-4">
        <span className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-[#6d6a66]" />
          <span>
            <span className="block text-base font-semibold text-[#1b1c1c]">
              Two-Factor Authentication (2FA)
            </span>
            <span className="block text-sm text-[#6d6a66]">
              Add an extra layer of security by requiring a code from your mobile device upon login.
            </span>
          </span>
        </span>
        <Button variant="outline" className="border-[#e0d8c9]">
          Enable 2FA
        </Button>
      </div>

      <div className="mt-6 flex justify-end border-t border-[#e0d8c9]/40 pt-4">
        <Button onClick={handleSave} disabled={saving} className="bg-[#d4af37] font-semibold">
          {saving ? "Saving…" : saved ? "Saved!" : "Save Privacy Settings"}
        </Button>
      </div>
    </Card>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>("account");

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
          Settings &amp; Profile
        </h1>
        <p className="mt-2 text-base text-[#6d6a66]">
          Manage your account preferences, notifications, and security settings.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        {/* Sidebar Tabs */}
        <nav className="flex flex-col gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "flex items-center gap-3 rounded-lg border-l-2 px-4 py-3 text-left text-sm font-semibold transition",
                tab === t.id
                  ? "border-[#d4af37] bg-[#fffdf8] text-[#735c00]"
                  : "border-transparent text-[#6d6a66] hover:bg-[#f5f3f3] hover:text-[#1b1c1c]"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div>
          {tab === "account" && <AccountTab />}
          {tab === "notifications" && <NotificationsTab />}
          {tab === "privacy" && <PrivacyTab />}
        </div>
      </div>
    </div>
  );
}
