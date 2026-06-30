import { prisma } from "@/lib/db/prisma";
import { TourStatus } from "@/lib/types/tour";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const tour = await prisma.tour.findUnique({
    where: { publicToken: token },
    include: {
      lead: true,
      unit: { include: { property: true } },
    },
  });

  if (!tour) notFound();

  return (
    <div className="min-h-dvh bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <header className="border-b border-slate-200/60 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center px-6 py-4">
          <h1 className="text-lg font-semibold text-slate-900">SmartTour</h1>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-6 py-16">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-indigo-500/5">

          {tour.status === TourStatus.PENDING_VERIFICATION && (
            <PendingState tour={tour} />
          )}

          {tour.status === TourStatus.APPROVED && (
            <ApprovedState tour={tour} />
          )}

          {tour.status === TourStatus.REJECTED && (
            <RejectedState />
          )}

        </div>
      </main>
    </div>
  );
}

function PendingState({ tour }: { tour: { lead: { fullName: string }; unit: { unitNumber: string; property: { name: string } }; scheduledAt: Date } }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-2xl">
        ⏳
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">Booking Received</h2>
      <p className="mt-2 text-sm text-slate-500">
        Your tour request is pending verification. A manager will review it shortly.
        Once approved, reload this page to see your access code.
      </p>
      <div className="mt-6 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm">
        <Row label="Name" value={tour.lead.fullName} />
        <Row label="Property" value={tour.unit.property.name} />
        <Row label="Unit" value={`Unit ${tour.unit.unitNumber}`} />
        <Row
          label="Scheduled"
          value={new Date(tour.scheduledAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        />
      </div>
      <button
        onClick={undefined}
        className="mt-6 w-full rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
      >
        <a href="">Refresh status</a>
      </button>
    </div>
  );
}

function ApprovedState({ tour }: { tour: { accessCode: string | null; lead: { fullName: string }; unit: { unitNumber: string; property: { name: string } }; scheduledAt: Date } }) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl">
        ✓
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">Tour Approved!</h2>
      <p className="mt-2 text-sm text-slate-500">
        Use the access code below to enter the property at your scheduled time.
      </p>
      <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-6">
        <p className="text-xs font-medium uppercase tracking-widest text-emerald-700">
          Your Access Code
        </p>
        <p className="mt-2 font-mono text-4xl font-bold tracking-widest text-emerald-900">
          {tour.accessCode}
        </p>
      </div>
      <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4 text-left text-sm">
        <Row label="Name" value={tour.lead.fullName} />
        <Row label="Property" value={tour.unit.property.name} />
        <Row label="Unit" value={`Unit ${tour.unit.unitNumber}`} />
        <Row
          label="Scheduled"
          value={new Date(tour.scheduledAt).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        />
      </div>
    </div>
  );
}

function RejectedState() {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">
        ✕
      </div>
      <h2 className="mt-4 text-xl font-bold text-slate-900">Tour Not Approved</h2>
      <p className="mt-2 text-sm text-slate-500">
        Unfortunately your tour request was not approved. Please contact us or book a different slot.
      </p>
      <Link
        href="/tours/book"
        className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
      >
        Book Another Tour
      </Link>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}
