"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Plus, CalendarClock, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/select/Select";
import { Textarea } from "@/components/ui/text-area/Textarea";
import { Badge } from "@/components/ui/badge/Badge";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e0d8c9]/40 px-4 py-4 sm:px-6">
          <div>
            <h1 className="font-['Hanken_Grotesk'] text-xl font-semibold text-[#1b1c1c] sm:text-2xl">
              Schedule Interview
            </h1>
            <p className="mt-1 text-sm text-[#6d6a66]">
              Send an invitation to the candidate
            </p>
          </div>
          <button
            onClick={() => router.back()}
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full hover:bg-[#f5f3f3]"
          >
            <X className="h-5 w-5 text-[#6d6a66]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
          <div className="flex flex-col gap-6">
            {/* Interview Type & Meeting Service */}
            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Interview Type"
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="h-12 rounded-lg border-[#e0d8c9]"
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
                className="h-12 rounded-lg border-[#e0d8c9]"
              >
                <option>Google Meet</option>
                <option>Zoom</option>
                <option>Microsoft Teams</option>
              </Select>
            </div>

            {/* Availability */}
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-center gap-2 text-sm font-semibold text-[#1b1c1c]">
                  <CalendarClock className="h-4 w-4 text-[#735c00]" />
                  Offer Availability
                  <span className="text-xs font-normal text-[#6d6a66]">(Select multiple)</span>
                </p>
                <Badge className="w-fit bg-[#f5f3f3] text-[#6d6a66]">Timezone: GMT</Badge>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {slots.map((slot) => (
                  <button
                    key={slot.iso}
                    onClick={() => toggleSlot(slot.iso)}
                    className={cn(
                      "rounded-lg border px-4 py-3 text-left text-sm font-medium transition",
                      selected.includes(slot.iso)
                        ? "border-[#d4af37] bg-[#fffdf8] text-[#1b1c1c] shadow-[0_0_0_2px_rgba(212,175,55,0.1)]"
                        : "border-[#e0d8c9] text-[#6d6a66] hover:border-[#d4af37]"
                    )}
                  >
                    {slot.label}
                  </button>
                ))}
                <button className="flex items-center justify-center gap-1 rounded-lg border border-dashed border-[#e0d8c9] px-4 py-3 text-sm font-medium text-[#6d6a66] hover:border-[#d4af37] hover:text-[#735c00]">
                  <Plus className="h-3.5 w-3.5" /> Suggest Time
                </button>
              </div>
            </div>

            {/* Message */}
            <div>
              <Textarea
                label="Message to Candidate"
                placeholder="Add a personal note..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="min-h-[100px] rounded-lg border-[#e0d8c9]"
              />
              <p className="mt-1 text-xs text-[#6d6a66]">
                Standard template will be appended.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-2 border-t border-[#e0d8c9]/40 px-4 py-4 sm:flex-row sm:items-center sm:justify-end sm:gap-2 sm:px-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-full text-[#6d6a66] sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={selected.length === 0 || isSubmitting}
            className="w-full bg-[#d4af37] font-semibold sm:w-auto"
          >
            <Video className="h-4 w-4" />
            {isSubmitting ? "Sending..." : "Send Invitation"}
          </Button>
        </div>
      </div>
    </div>
  );
}