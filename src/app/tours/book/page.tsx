"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface TourSlotOption {
  id: number;
  startTime: string;
  endTime: string;
  unit: {
    unitNumber: string;
    property: { name: string };
  };
}

export default function BookTourPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    tourSlotId: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const [slots, setSlots] = useState<TourSlotOption[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/tours")
      .then((res) => res.json())
      .then((data) => setSlots(data.tourSlots ?? []))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, []);

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const formatSlotLabel = (slot: TourSlotOption) => {
    const start = new Date(slot.startTime);
    return `${slot.unit.property.name} — Unit ${slot.unit.unitNumber} — ${start.toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    })}`;
  };

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">SmartTour</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-500/5">
          <h2 className="text-xl font-bold text-slate-900">
            Book a Self-Guided Tour
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Fill in your details and pick a time slot.
          </p>

          <form
              onSubmit={async (e) => {
                e.preventDefault();
                setStatus("submitting");
                setErrorMessage("");
                try {
                  const res = await fetch("/api/tours", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      tourSlotId: Number(formData.tourSlotId),
                      fullName: formData.name,
                      email: formData.email,
                      phoneNumber: formData.phone,
                    }),
                  });

                  if (!res.ok) {
                    const data = await res.json().catch(() => ({}));
                    setErrorMessage(data.error ?? "Failed to book tour");
                    setStatus("error");
                    return;
                  }

                  const { tour } = await res.json();
                  router.push(`/tours/confirmation/${tour.publicToken}`);
                } catch {
                  setErrorMessage("Failed to book tour");
                  setStatus("error");
                }
              }}
              className="mt-6 space-y-4"
            >
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Full Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Jane Smith"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="jane@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700">
                    Phone *
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="tourSlotId" className="block text-sm font-medium text-slate-700">
                  Tour Slot *
                </label>
                <select
                  id="tourSlotId"
                  required
                  disabled={slotsLoading || slots.length === 0}
                  value={formData.tourSlotId}
                  onChange={(e) => updateField("tourSlotId", e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm transition focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="">
                    {slotsLoading
                      ? "Loading available slots..."
                      : slots.length === 0
                        ? "No tour slots available"
                        : "Select a tour slot"}
                  </option>
                  {slots.map((slot) => (
                    <option key={slot.id} value={slot.id}>
                      {formatSlotLabel(slot)}
                    </option>
                  ))}
                </select>
              </div>

              {status === "error" && (
                <p className="text-sm text-red-600">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting..." : "Book My Tour"}
              </button>
          </form>
        </div>
      </main>
    </div>
  );
}
