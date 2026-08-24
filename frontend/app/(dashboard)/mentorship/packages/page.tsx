"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useAsync } from "@/lib/use-async";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
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
    <div className="flex flex-col gap-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-headline-lg text-on-background">Mentorship Packages</h1>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Manage your offerings and set your professional boundaries.
          </p>
        </div>
        <Button onClick={() => setShowForm((v) => !v)}>
          <Plus className="h-4 w-4" /> Create New Package
        </Button>
      </div>

      {showForm && (
        <Card className="flex flex-col gap-md">
          <h2 className="text-headline-md text-on-background">New Package</h2>
          <Input
            label="Title"
            placeholder="e.g. Portfolio Review"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <div className="grid gap-md sm:grid-cols-3">
            <Input label="Price (USD)" value={price} onChange={(e) => setPrice(e.target.value)} />
            <Input
              label="Duration (mins)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />
            <Input
              label="Sessions"
              value={sessions}
              onChange={(e) => setSessions(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!title || saving}>
              {saving ? "Saving…" : "Save Package"}
            </Button>
          </div>
        </Card>
      )}

      <div className="grid gap-md sm:grid-cols-2">
        {packages.isLoading ? (
          <p className="text-body-md text-on-surface-variant">Loading…</p>
        ) : packages.data && packages.data.length > 0 ? (
          packages.data.map((pkg) => (
            <Card key={pkg.id}>
              <div className="flex items-center justify-between">
                <h2 className="text-headline-md text-on-background">{pkg.title}</h2>
                <button
                  onClick={() => handleToggle(pkg.id)}
                  className={cn(
                    "flex h-6 w-11 items-center rounded-full px-0.5 transition",
                    pkg.is_active
                      ? "justify-end bg-primary-container"
                      : "justify-start bg-outline-variant"
                  )}
                >
                  <span className="h-5 w-5 rounded-full bg-white shadow" />
                </button>
              </div>
              <div className="mt-3 flex gap-md">
                <div>
                  <p className="text-label-sm uppercase text-on-surface-variant">Price</p>
                  <p className="text-headline-md text-on-background">
                    {pkg.currency} {pkg.price}
                  </p>
                </div>
                <div>
                  <p className="text-label-sm uppercase text-on-surface-variant">Duration</p>
                  <p className="text-body-md text-on-surface">
                    {pkg.duration_minutes} mins{pkg.session_count > 1 ? `/ea` : ""}
                  </p>
                  <p className="text-label-sm text-on-surface-variant">
                    {pkg.session_count} Session{pkg.session_count > 1 ? "s" : ""}
                  </p>
                </div>
              </div>
              <p className="mt-4 border-t border-outline-variant/40 pt-3 text-body-md text-on-surface-variant">
                {pkg.description}
              </p>
              {pkg.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {pkg.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface-container-high px-3 py-1 text-label-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Card>
          ))
        ) : (
          <p className="text-body-md text-on-surface-variant">
            No packages yet — create your first offering above.
          </p>
        )}
      </div>
    </div>
  );
}
