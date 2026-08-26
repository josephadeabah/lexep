"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Avatar } from "@/components/ui/Avatar";

const SESSION_TYPES = [
  {
    id: "30-min Intro",
    title: "30-min Intro",
    description: "Quick chat to align on goals and see if it's a good fit.",
  },
  {
    id: "60-min Deep Dive",
    title: "60-min Deep Dive",
    description: "Detailed portfolio review or specific project feedback.",
  },
];

const SLOTS = ["09:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"];

function buildCalendarDays(base: Date) {
  const days: Date[] = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    days.push(d);
  }
  return days;
}

export default function RequestSessionPage() {
  const params = useParams<{ mentorId: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const mentorId = Number(params.mentorId);
  const packageId = searchParams.get("package");

  const mentor = useAsync(() => api.getMentor(mentorId), [mentorId]);

  const [sessionType, setSessionType] = useState(SESSION_TYPES[0].id);
  const [message, setMessage] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const days = useMemo(() => buildCalendarDays(new Date()), []);

  function toggleSlot(slot: string) {
    const iso = new Date(`${selectedDate.toDateString()} ${slot}`).toISOString();
    setSelectedSlots((prev) =>
      prev.includes(iso) ? prev.filter((s) => s !== iso) : prev.length < 3 ? [...prev, iso] : prev
    );
  }

  async function handleSend() {
    setIsSubmitting(true);
    try {
      const body: Record<string, unknown> = {
        mentor_id: mentorId,
        session_type: sessionType,
        message,
        proposed_times: selectedSlots,
      };
      if (packageId) body.package_id = Number(packageId);
      await api.requestMentorship(body);
      router.push("/mentorship/request-sent");
    } finally {
      setIsSubmitting(false);
    }
  }

  const m = mentor.data;

  return (
    <div>
      <div className="mb-lg">
        <h1 className="text-headline-lg text-on-background">Request Session</h1>
        <p className="text-body-md text-on-surface-variant mt-1">
          Propose times for a mentorship session with your selected mentor.
        </p>
      </div>

      <div className="gap-md grid lg:grid-cols-[1fr_320px]">
        <div className="gap-md flex flex-col">
          {m && (
            <Card className="flex items-center gap-4">
              <Avatar name={m.user.full_name} src={m.user.avatar_url} size={56} />
              <div>
                <p className="text-headline-md text-on-background">{m.user.full_name}</p>
                <p className="text-body-md text-on-surface-variant">
                  {m.title} {m.company && `at ${m.company}`}
                </p>
              </div>
            </Card>
          )}

          <Card>
            <p className="text-label-md text-on-background flex items-center gap-2">
              <span className="bg-primary-fixed text-label-sm flex h-6 w-6 items-center justify-center rounded-full">
                1
              </span>
              Session Type
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {SESSION_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSessionType(type.id)}
                  className={cn(
                    "rounded-md border p-4 text-left transition",
                    sessionType === type.id
                      ? "border-primary-container bg-surface-container-low"
                      : "border-outline-variant"
                  )}
                >
                  <p className="text-label-md text-on-background">{type.title}</p>
                  <p className="text-label-sm text-on-surface-variant mt-1">{type.description}</p>
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <p className="text-label-md text-on-background flex items-center gap-2">
              <span className="bg-primary-fixed text-label-sm flex h-6 w-6 items-center justify-center rounded-full">
                2
              </span>
              Message for Mentor
            </p>
            <div className="mt-3">
              <Textarea
                label="What would you like to discuss?"
                placeholder="Briefly describe your goals for this session…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </Card>

          <Card>
            <p className="text-label-md text-on-background flex items-center gap-2">
              <span className="bg-primary-fixed text-label-sm flex h-6 w-6 items-center justify-center rounded-full">
                3
              </span>
              Propose Times
            </p>
            <p className="text-label-sm text-on-surface-variant">
              Select up to 3 time slots that work for you.
            </p>

            <div className="mt-3 flex gap-1 overflow-x-auto pb-2">
              {days.map((day) => {
                const active = day.toDateString() === selectedDate.toDateString();
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "text-label-sm flex min-w-[56px] flex-col items-center rounded-md px-3 py-2",
                      active
                        ? "bg-primary-container text-on-primary-container"
                        : "bg-surface-container-low text-on-surface-variant"
                    )}
                  >
                    <span>{day.toLocaleDateString("en-US", { weekday: "short" })}</span>
                    <span className="text-label-md">{day.getDate()}</span>
                  </button>
                );
              })}
            </div>

            <div className="bg-surface-container-low mt-3 rounded-md p-3">
              <p className="text-label-sm text-on-surface-variant mb-2">
                Available slots for{" "}
                {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {SLOTS.map((slot) => {
                  const iso = new Date(`${selectedDate.toDateString()} ${slot}`).toISOString();
                  const active = selectedSlots.includes(iso);
                  return (
                    <button
                      key={slot}
                      onClick={() => toggleSlot(slot)}
                      className={cn(
                        "text-label-sm rounded-md border px-3 py-2",
                        active
                          ? "border-primary-container bg-primary-fixed text-on-primary-fixed-variant"
                          : "border-outline-variant bg-surface-container-lowest"
                      )}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <h2 className="text-headline-md text-on-background">Request Summary</h2>
            <div className="border-outline-variant/40 text-body-md mt-3 flex flex-col gap-3 border-t pt-3">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Mentor</span>
                <span className="text-on-background">{m?.user.full_name ?? "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Session Type</span>
                <span className="text-on-background">{sessionType}</span>
              </div>
              <div>
                <span className="text-on-surface-variant">Proposed Times</span>
                <ul className="text-label-sm text-on-background mt-1 list-disc pl-5">
                  {selectedSlots.length === 0 && (
                    <li className="text-on-surface-variant list-none">None selected yet</li>
                  )}
                  {selectedSlots.map((s) => (
                    <li key={s}>
                      {new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" })},{" "}
                      {new Date(s).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Button
              className="mt-md w-full"
              onClick={handleSend}
              disabled={selectedSlots.length === 0 || isSubmitting}
            >
              {isSubmitting ? "Sending…" : "Send Request ▷"}
            </Button>
            <p className="text-label-sm text-on-surface-variant mt-2">
              The mentor will have 48 hours to confirm.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
