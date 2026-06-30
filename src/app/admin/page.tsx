import { ApproveRejectButtons } from "@/app/admin/_components/approve-reject-buttons";
import { prisma } from "@/lib/db/prisma";

export default async function AdminPage() {
  const tours = await prisma.tour.findMany({
    where: { status: "PENDING_VERIFICATION" },
    orderBy: { createdAt: "desc" },
    include: {
      lead: true,
      unit: { include: { property: true } },
    },
  });

  return (
    <div className="min-h-dvh bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">SmartTour</h1>
            <p className="text-xs text-slate-500">Manager Dashboard</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-xl font-bold text-slate-900">
          Pending Tour Requests
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {tours.length === 0
            ? "No pending requests."
            : `${tours.length} booking${tours.length !== 1 ? "s" : ""} awaiting review.`}
        </p>

        {tours.length > 0 && (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Lead</th>
                  <th className="px-4 py-3">Property / Unit</th>
                  <th className="px-4 py-3">Tour Slot</th>
                  <th className="px-4 py-3">Submitted</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tours.map((tour) => (
                  <tr key={tour.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {tour.lead.fullName}
                      </p>
                      <p className="text-slate-500">{tour.lead.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-slate-900">
                        {tour.unit.property.name}
                      </p>
                      <p className="text-slate-500">Unit {tour.unit.unitNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {new Date(tour.scheduledAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-slate-700">
                        {new Date(tour.createdAt).toLocaleString(undefined, {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <ApproveRejectButtons tourId={tour.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
