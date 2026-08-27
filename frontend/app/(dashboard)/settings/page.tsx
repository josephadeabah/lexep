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
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-headline-md text-on-background">Account Information</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="text-label-md text-primary hover:underline"
          >
            Edit
          </button>
        )}
      </div>

      <div className="mt-md gap-md border-outline-variant/40 pb-md flex items-center border-b">
        <Avatar name={user.full_name} src={user.avatar_url} size={72} />
        <div className="flex-1">
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={!editing}
          />
        </div>
      </div>

      <div className="mt-md gap-md flex flex-col">
        <Input label="Email Address" value={user.email} disabled />
        <div className="flex items-end gap-3">
          <Input label="Password" type="password" value="•••••••••••" disabled className="flex-1" />
          <Button variant="ghost">Change Password</Button>
        </div>
      </div>

      {editing && (
        <div className="mt-md flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setEditing(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
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
          "flex h-6 w-11 flex-shrink-0 items-center rounded-full px-0.5 transition",
          on ? "bg-primary-container justify-end" : "bg-outline-variant justify-start"
        )}
      >
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white shadow">
          {on && <Check className="text-primary h-3 w-3" />}
        </span>
      </button>
    );
  }

  return (
    <Card>
      <div className="flex items-center gap-3">
        <span className="bg-primary-fixed flex h-10 w-10 items-center justify-center rounded-full">
          <Bell className="text-on-primary-fixed-variant h-5 w-5" />
        </span>
        <div>
          <h2 className="text-headline-md text-on-background">Notification Preferences</h2>
          <p className="text-label-sm text-on-surface-variant">
            Control how and when you receive updates.
          </p>
        </div>
      </div>

      <p className="mt-md text-label-sm text-on-surface-variant flex items-center gap-2 tracking-wide uppercase">
        <Mail className="h-3.5 w-3.5" /> Email Notifications
      </p>
      <div className="divide-outline-variant/40 mt-2 flex flex-col divide-y">
        {EMAIL_OPTIONS.map((o) => (
          <div key={o.key} className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="text-body-md text-on-surface block">{o.label}</span>
              <span className="text-label-sm text-on-surface-variant block">{o.description}</span>
            </span>
            <Toggle optKey={o.key} />
          </div>
        ))}
      </div>

      <p className="mt-md text-label-sm text-on-surface-variant flex items-center gap-2 tracking-wide uppercase">
        <Smartphone className="h-3.5 w-3.5" /> Push Notifications
      </p>
      <div className="divide-outline-variant/40 mt-2 flex flex-col divide-y">
        {PUSH_OPTIONS.map((o) => (
          <div key={o.key} className="flex items-center justify-between gap-4 py-4">
            <span>
              <span className="text-body-md text-on-surface block">{o.label}</span>
              <span className="text-label-sm text-on-surface-variant block">{o.description}</span>
            </span>
            <Toggle optKey={o.key} />
          </div>
        ))}
      </div>

      <div className="mt-md border-outline-variant/40 pt-md flex justify-end gap-2 border-t">
        <Button variant="ghost">Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
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
    <Card>
      <h2 className="text-headline-md text-on-background">Profile Visibility</h2>
      <p className="text-label-sm text-on-surface-variant">
        Control who can see your profile and academic achievements within the network.
      </p>
      <div className="mt-3 flex flex-col gap-3">
        {VISIBILITY_OPTIONS.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-start gap-3">
            <Radio checked={visibility === o.id} onChange={() => setVisibility(o.id)} />
            <span>
              <span className="text-body-md text-on-surface block">{o.label}</span>
              <span className="text-label-sm text-on-surface-variant block">{o.description}</span>
            </span>
          </label>
        ))}
      </div>

      <h2 className="mt-lg border-outline-variant/40 pt-md text-headline-md text-on-background border-t">
        Data Sharing
      </h2>
      <p className="text-label-sm text-on-surface-variant">
        Manage how your data is used to improve our services and programs.
      </p>
      <label className="bg-surface-container-low mt-3 flex cursor-pointer items-start gap-3 rounded-md p-4">
        <Checkbox
          checked={shareAnonymizedData}
          onChange={(e) => setShareAnonymizedData(e.target.checked)}
        />
        <span>
          <span className="text-body-md text-on-surface block">
            Share anonymized data with educational partners
          </span>
          <span className="text-label-sm text-on-surface-variant block">
            We use this data to secure more grants and opportunities for the community. Your
            personal identity remains hidden.
          </span>
        </span>
      </label>

      <h2 className="mt-lg border-outline-variant/40 pt-md text-headline-md text-on-background border-t">
        Account Security
      </h2>
      <p className="text-label-sm text-on-surface-variant">
        Enhance the protection of your professional account.
      </p>
      <div className="border-outline-variant mt-3 flex items-center justify-between rounded-md border p-4">
        <span className="flex items-center gap-3">
          <Shield className="text-on-surface-variant h-5 w-5" />
          <span>
            <span className="text-body-md text-on-surface block">
              Two-Factor Authentication (2FA)
            </span>
            <span className="text-label-sm text-on-surface-variant block">
              Add an extra layer of security by requiring a code from your mobile device upon login.
            </span>
          </span>
        </span>
        <Button variant="ghost">Enable 2FA</Button>
      </div>

      <div className="mt-md border-outline-variant/40 pt-md flex justify-end border-t">
        <Button onClick={handleSave} disabled={saving}>
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
      <div className="mb-lg">
        <h1 className="text-headline-lg text-on-background">Settings &amp; Profile</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Manage your account preferences, notifications, and security settings.
        </p>
      </div>

      <div className="gap-md grid lg:grid-cols-[240px_1fr]">
        <nav className="flex flex-col gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "text-label-md flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-left transition",
                tab === t.id
                  ? "border-primary-container bg-surface-container-low text-primary"
                  : "text-on-surface-variant hover:bg-surface-container-low border-transparent"
              )}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </nav>

        {tab === "account" && <AccountTab />}
        {tab === "notifications" && <NotificationsTab />}
        {tab === "privacy" && <PrivacyTab />}
      </div>
    </div>
  );
}
