"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";

function nextBusinessSlots(): { label: string; iso: string }[] {
  const slots: { label: string; iso: string }[] = [];
  const base = new Date();
  base.setDate(base.getDate() + 2);
  const times = [10, 14, 11];
  times.forEach((hour, i) => {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    d.setHours(hour, 0, 0, 0);
    slots.push({
      label:
        d.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        ` ${hour % 12 || 12}:00 ${hour < 12 ? "AM" : "PM"}`,
      iso: d.toISOString(),
    });
  });
  return slots;
}

export default function ProposeInterviewPage() {
  const params = useParams<{ applicationId: string }>();
  const router = useRouter();
  const applicationId = Number(params.applicationId);

  const [interviewType, setInterviewType] = useState("Technical Assessment");
  const [meetingService, setMeetingService] = useState("Google Meet");
  const [message, setMessage] = useState("");
  const [slots] = useState(nextBusinessSlots());
  const [selected, setSelected] = useState<string[]>(slots.slice(0, 2).map((s) => s.iso));
  const [isSubmitting, setIsSubmitting] = useState(false);

  function toggleSlot(iso: string) {
    setSelected((prev) => (prev.includes(iso) ? prev.filter((s) => s !== iso) : [...prev, iso]));
  }

  async function handleSend() {
    setIsSubmitting(true);
    try {
      await api.proposeInterview({
        application_id: applicationId,
        interview_type: interviewType,
        meeting_service: meetingService,
        proposed_times: selected,
        message_to_candidate: message,
      });
      router.push("/interviews");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-gutter">
      <div className="w-full max-w-lg overflow-hidden rounded-lg bg-surface-container-lowest shadow-level2">
        <div className="flex items-center justify-between border-b border-outline-variant/40 p-md">
          <div>
            <h1 className="text-headline-md text-on-background">Schedule Interview</h1>
            <p className="text-body-md text-on-surface-variant">
              Send an invitation to the candidate
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="text-on-surface-variant hover:text-on-background"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] overflow-y-auto p-md">
          <div className="flex flex-col gap-md">
            <div className="grid gap-md sm:grid-cols-2">
              <Select
                label="Interview Type"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
              >
                <option>Technical Assessment</option>
                <option>Portfolio Review</option>
                <option>Culture Fit</option>
                <option>Final Round</option>
              </Select>
              <Select
                label="Meeting Service"
                value={meetingService}
                onChange={(e) => setMeetingService(e.target.value)}
              >
                <option>Google Meet</option>
                <option>Zoom</option>
                <option>Microsoft Teams</option>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-label-md text-on-surface">
                  Offer Availability (Select multiple)
                </p>
                <span className="text-label-sm text-on-surface-variant">Timezone: GMT</span>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {slots.map((slot) => (
                  <button
                    key={slot.iso}
                    onClick={() => toggleSlot(slot.iso)}
                    className={cn(
                      "rounded-md border p-3 text-left text-label-sm transition",
                      selected.includes(slot.iso)
                        ? "border-primary-container bg-primary-fixed text-on-primary-fixed-variant"
                        : "border-outline-variant text-on-surface"
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
                <button className="flex items-center justify-center gap-1 rounded-md border border-dashed border-outline-variant p-3 text-label-sm text-on-surface-variant">
                  <Plus className="h-3.5 w-3.5" /> Suggest Time
                </button>
              </div>
            </div>

            <Textarea
              label="Message to Candidate"
              placeholder="Add a personal note…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <p className="text-label-sm text-on-surface-variant">
              Standard template will be appended.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-outline-variant/40 p-md">
          <Button variant="ghost" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={selected.length === 0 || isSubmitting}>
            {isSubmitting ? "Sending…" : "Send Invitation ▷"}
          </Button>
        </div>
      </div>
    </div>
  );
}
