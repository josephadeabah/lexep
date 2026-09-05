"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, CalendarClock, FileText, Settings as SettingsIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { SharedShell } from "@/components/layout/SharedShell";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Pagination } from "@/components/ui/Pagination";
import type { AppNotification } from "@/lib/types";

const TABS = [
  { id: undefined, label: "All" },
  { id: "unread" as const, label: "Unread" },
  { id: "mentorship" as const, label: "Mentorship" },
];

const ICON_BY_TYPE: Record<string, typeof GraduationCap> = {
  new_course: GraduationCap,
  interview_scheduled: CalendarClock,
  interview_confirmed: CalendarClock,
  assessment_graded: FileText,
};

function NotificationCard({ notification, onRead }: { notification: AppNotification; onRead: (id: number) => void }) {
  const Icon = ICON_BY_TYPE[notification.type] ?? FileText;
  return (
    <Card
      className={cn("flex items-start gap-4 border-l-2", notification.is_read ? "border-l-transparent" : "border-l-primary-container")}
    >
      <span
        className={cn(
          "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full",
          notification.is_read ? "bg-surface-container-high text-on-surface-variant" : "bg-primary-fixed text-on-primary-fixed-variant"
        )}
      >
        <Icon className="h-5 w-5" />
      </span>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <p className="text-label-md text-on-background">{notification.title}</p>
          <span className="whitespace-nowrap text-label-sm text-on-surface-variant">
            {new Date(notification.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
        {notification.body && <p className="mt-1 text-body-md text-on-surface-variant">{notification.body}</p>}
        <div className="mt-3 flex gap-2">
          {notification.action_url && (
            <Button size="sm" href={notification.action_url} onClick={() => onRead(notification.id)}>
              {notification.action_label ?? "View"}
            </Button>
          )}
          {!notification.is_read && (
            <Button size="sm" variant="ghost" onClick={() => onRead(notification.id)}>
              Mark as read
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

function NotificationCenterContent() {
  const [tab, setTab] = useState<"unread" | "mentorship" | undefined>(undefined);
  const [page, setPage] = useState(1);
  const notifications = useAsync(() => api.listNotifications(tab, page, 10), [tab, page]);

  async function markRead(id: number) {
    await api.markNotificationRead(id);
    notifications.refetch();
  }

  async function markAllRead() {
    await api.markAllNotificationsRead();
    notifications.refetch();
  }

  return (
    <div className="grid gap-md lg:grid-cols-[1fr_300px]">
      <div>
        <div className="mb-lg flex items-center justify-between">
          <div>
            <h1 className="text-headline-lg text-on-background">Notification Center</h1>
            <p className="mt-1 text-body-md text-on-surface-variant">Stay updated on your learning journey and network activity.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={markAllRead}>
            Mark all as read
          </Button>
        </div>

        <div className="mb-md flex gap-lg border-b border-outline-variant/40">
          {TABS.map((t) => (
            <button
              key={t.label}
              onClick={() => {
                setTab(t.id);
                setPage(1);
              }}
              className={cn(
                "border-b-2 px-1 pb-3 text-label-md transition",
                tab === t.id ? "border-primary-container text-on-background" : "border-transparent text-on-surface-variant"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {notifications.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading…</p>
        ) : notifications.data && notifications.data.items.length > 0 ? (
          <div className="flex flex-col gap-3">
            {notifications.data.items.map((n) => (
              <NotificationCard key={n.id} notification={n} onRead={markRead} />
            ))}
            <Pagination page={notifications.data.page} totalPages={notifications.data.total_pages} onPageChange={setPage} className="mt-md" />
          </div>
        ) : (
          <p className="text-body-md text-on-surface-variant">You&apos;re all caught up.</p>
        )}
      </div>

      <div>
        <Card>
          <h2 className="text-headline-md text-on-background">Notification Settings</h2>
          <p className="mt-2 text-body-md text-on-surface-variant">Manage how you receive updates and alerts.</p>
          <Button href="/settings" variant="secondary" className="mt-3">
            <SettingsIcon className="h-4 w-4" /> Configure Preferences
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  return (
    <SharedShell>
      <NotificationCenterContent />
    </SharedShell>
  );
}
