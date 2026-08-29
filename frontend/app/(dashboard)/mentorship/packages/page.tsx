"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import { Textarea } from "@/components/ui/text-area/Textarea";
import { cn } from "@/lib/utils";

export default function MentorPackagesPage() {
  const packages = useAsync(() => api.myPackages(), []);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("60");
  const [sessions, setSessions] = useState("1");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setSaving(true);
    try {
      await api.createPackage({
        title,
        description,
        price: Number(price || 0),
        duration_minutes: Number(duration || 60),
        session_count: Number(sessions || 1),
      });
      setTitle("");
      setDescription("");
      setPrice("");
      setShowForm(false);
      packages.refetch();
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(id: number) {
    await api.togglePackage(id);
    packages.refetch();
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-['Hanken_Grotesk'] text-4xl font-bold tracking-[-0.045em] text-[#1b1c1c]">
            Mentorship Packages
          </h1>
          <p className="mt-2 text-base text-[#6d6a66]">
            Manage your offerings and set your professional boundaries.
          </p>
        </div>
        <Button
          onClick={() => setShowForm((v) => !v)}
          className="bg-[#d4af37] font-semibold text-[#1b1c1c] hover:bg-[#c9a32e]"
        >
          <Plus className="h-4 w-4" /> Create New Package
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="flex flex-col gap-6 border border-[#e0d8c9] p-8">
          <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
            New Package
          </h2>

          <Input
            label="Title"
            placeholder="e.g. Portfolio Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 rounded-lg border-[#e0d8c9]"
          />

          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[120px] rounded-lg border-[#e0d8c9]"
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <Input
              label="Price (USD)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="h-12 rounded-lg border-[#e0d8c9]"
            />
            <Input
              label="Duration (mins)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="h-12 rounded-lg border-[#e0d8c9]"
            />
            <Input
              label="Sessions"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
              className="h-12 rounded-lg border-[#e0d8c9]"
            />
          </div>

          <div className="flex justify-end gap-2 border-t border-[#e0d8c9]/40 pt-4">
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!title || saving}
              className="bg-[#d4af37] font-semibold"
            >
              {saving ? "Saving…" : "Save Package"}
            </Button>
          </div>
        </Card>
      )}

      {/* Packages Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {packages.isLoading ? (
          <p className="text-base text-[#6d6a66]">Loading…</p>
        ) : packages.data && packages.data.length > 0 ? (
          packages.data.map((pkg) => (
            <Card key={pkg.id} className="flex flex-col p-6">
              {/* Header with Toggle */}
              <div className="flex items-start justify-between gap-4">
                <h2 className="font-['Hanken_Grotesk'] text-2xl font-semibold text-[#1b1c1c]">
                  {pkg.title}
                </h2>
                <button
                  onClick={() => handleToggle(pkg.id)}
                  className={cn(
                    "flex h-6 w-11 flex-shrink-0 items-center rounded-full px-0.5 transition",
                    pkg.is_active
                      ? "bg-[#d4af37] justify-end"
                      : "bg-[#e0d8c9] justify-start"
                  )}
                >
                  <span className="h-5 w-5 rounded-full bg-white shadow" />
                </button>
              </div>

              {/* Price & Duration */}
              <div className="mt-4 border-b border-[#e0d8c9]/40 pb-4">
                <div className="flex gap-8">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6d6a66]">
                      Price
                    </p>
                    <p className="mt-1 font-['Hanken_Grotesk'] text-3xl font-bold text-[#1b1c1c]">
                      ${pkg.price}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#6d6a66]">
                      Duration
                    </p>
                    <p className="mt-1 text-base font-semibold text-[#1b1c1c]">
                      {pkg.duration_minutes} mins{pkg.session_count > 1 ? `/ea` : ""}
                    </p>
                    <p className="text-sm text-[#6d6a66]">
                      {pkg.session_count} Session{pkg.session_count > 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-[#6d6a66]">
                {pkg.description}
              </p>

              {/* Tags */}
              {pkg.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {pkg.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#f5f3f3] px-3 py-1 text-xs font-medium text-[#6d6a66]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))
        ) : (
          <p className="text-base text-[#6d6a66]">
            No packages yet — create your first offering above.
          </p>
        )}
      </div>
    </div>
  );
}