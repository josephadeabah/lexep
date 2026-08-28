"use client";

import { useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/text-area/Textarea";
import { Avatar } from "@/components/ui/avatar/Avatar";
import { Badge } from "@/components/ui/badge/Badge";
import { Logo } from "@/components/ui/Logo";

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
    <div className="min-h-screen bg-[#fbf9f8]">
      {/* Full Page Layout */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/mentorship/${mentorId}`)}
          className="mb-6 flex items-center gap-2 text-sm font-semibold text-[#6d6a66] transition hover:text-[#735c00]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Mentors
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
            Request Session
          </h1>
          <p className="mt-2 text-lg text-[#6d6a66]">
            Propose times for a mentorship session with your selected mentor.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* Left Content */}
          <div className="space-y-6">
            {/* Mentor Info */}
            {m && (
              <Card className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={m.user.full_name}
                    src={m.user.avatar_url}
                    size={64}
                    className="rounded-full"
                  />
                  <div>
                    <p className="flex items-center gap-2 font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
                      {m.user.full_name}
                      <span className="text-[#6d6a66]">@</span>
                      {m.company}
                    </p>
                    <p className="mt-1 text-sm text-[#6d6a66]">
                      {m.title} at {m.company}
                    </p>
                    <div className="mt-2 flex gap-2">
                      <Badge className="bg-[#f5f3f3] text-[#6d6a66]">Portfolio Review</Badge>
                      <Badge className="bg-[#f5f3f3] text-[#6d6a66]">Career Advice</Badge>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Session Type */}
            <Card className="p-6">
              <p className="flex items-center gap-3 text-sm font-semibold text-[#1b1c1c]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#1b1c1c]">
                  1
                </span>
                Session Type
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {SESSION_TYPES.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSessionType(type.id)}
                    className={cn(
                      "relative rounded-xl border p-5 text-left transition",
                      sessionType === type.id
                        ? "border-[#d4af37] bg-[#fffdf8] shadow-[0_0_0_3px_rgba(212,175,55,0.1)]"
                        : "border-[#e0d8c9] hover:border-[#d4af37]"
                    )}
                  >
                    {sessionType === type.id && (
                      <CheckCircle2 className="absolute right-4 top-4 h-5 w-5 text-[#d4af37]" />
                    )}
                    <p className="font-['Hanken_Grotesk'] text-lg font-semibold text-[#1b1c1c]">
                      {type.title}
                    </p>
                    <p className="mt-1 text-sm text-[#6d6a66]">{type.description}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Message */}
            <Card className="p-6">
              <p className="flex items-center gap-3 text-sm font-semibold text-[#1b1c1c]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#1b1c1c]">
                  2
                </span>
                Message for Mentor
              </p>
              <div className="mt-4">
                <Textarea
                  label="What would you like to discuss?"
                  placeholder="Briefly describe your goals for this session..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[160px] rounded-lg border-[#e0d8c9]"
                />
              </div>
            </Card>

            {/* Propose Times */}
            <Card className="p-6">
              <p className="flex items-center gap-3 text-sm font-semibold text-[#1b1c1c]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#d4af37] text-xs font-bold text-[#1b1c1c]">
                  3
                </span>
                Propose Times
              </p>
              <p className="mt-2 text-sm text-[#6d6a66]">
                Select up to 3 time slots that work for you.
              </p>

              {/* Calendar */}
              <div className="mt-4 rounded-xl border border-[#e0d8c9] p-4">
                {/* Month Navigation */}
                <div className="flex items-center justify-between">
                  <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f3f3]">
                    <ChevronLeft className="h-4 w-4 text-[#6d6a66]" />
                  </button>
                  <p className="text-sm font-semibold text-[#1b1c1c]">
                    {selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-[#f5f3f3]">
                    <ChevronRight className="h-4 w-4 text-[#6d6a66]" />
                  </button>
                </div>

                {/* Days Grid */}
                <div className="mt-4 grid grid-cols-7 gap-2">
                  {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-[#6d6a66]">
                      {day}
                    </div>
                  ))}
                  {days.map((day) => {
                    const active = day.toDateString() === selectedDate.toDateString();
                    return (
                      <button
                        key={day.toISOString()}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "flex h-10 w-full items-center justify-center rounded-full text-sm transition",
                          active
                            ? "bg-[#d4af37] font-bold text-[#1b1c1c]"
                            : "text-[#1b1c1c] hover:bg-[#f5f3f3]"
                        )}
                      >
                        {day.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slots */}
              <div className="mt-4 rounded-xl bg-[#f5f3f3] p-4">
                <p className="text-sm text-[#6d6a66]">
                  Available slots for{" "}
                  {selectedDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {SLOTS.map((slot) => {
                    const iso = new Date(`${selectedDate.toDateString()} ${slot}`).toISOString();
                    const active = selectedSlots.includes(iso);
                    return (
                      <button
                        key={slot}
                        onClick={() => toggleSlot(slot)}
                        className={cn(
                          "rounded-md border px-3 py-2 text-sm font-medium transition",
                          active
                            ? "border-[#d4af37] bg-[#fffdf8] text-[#1b1c1c]"
                            : "border-[#e0d8c9] bg-white text-[#6d6a66] hover:border-[#d4af37]"
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

          {/* Right Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
                Request Summary
              </h2>

              <div className="mt-4 space-y-4 border-t border-[#e0d8c9]/40 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-[#6d6a66]">Mentor</span>
                  <span className="text-sm font-semibold text-[#1b1c1c]">
                    {m?.user.full_name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#6d6a66]">Session Type</span>
                  <span className="text-sm font-semibold text-[#1b1c1c]">{sessionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#6d6a66]">Proposed Times</span>
                  <span className="text-sm font-semibold text-[#1b1c1c]">
                    {selectedSlots.length > 0
                      ? `${new Date(selectedSlots[0]).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}, ${new Date(selectedSlots[0]).toLocaleTimeString("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        })}`
                      : "None selected"}
                  </span>
                </div>
              </div>

              <Button
                className="mt-6 w-full bg-[#d4af37] font-semibold text-[#1b1c1c] hover:bg-[#c9a32e]"
                onClick={handleSend}
                disabled={selectedSlots.length === 0 || isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Request"} <ArrowRight className="h-4 w-4" />
              </Button>
              <p className="mt-3 text-center text-xs text-[#6d6a66]">
                The mentor will have 48 hours to confirm.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}