"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ApproveRejectButtons({ tourId }: { tourId: number }) {
  const router = useRouter();
  const [pending, setPending] = useState<"approve" | "reject" | null>(null);
  const [error, setError] = useState("");

  const act = async (action: "approve" | "reject") => {
    setPending(action);
    setError("");
    try {
      const res = await fetch(`/api/admin/tours/${tourId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setPending(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => act("approve")}
        disabled={!!pending}
        className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {pending === "approve" ? "Approving…" : "Approve"}
      </button>
      <button
        onClick={() => act("reject")}
        disabled={!!pending}
        className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
      >
        {pending === "reject" ? "Rejecting…" : "Reject"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
