import { prisma } from "@/lib/db/prisma";
import { sendApprovalConfirmation } from "@/lib/email/mailer";
import { AccessProvisioningService } from "@/lib/services/access-provisioning-service";
import { TourStatus } from "@/lib/types/tour";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const ActionSchema = z.object({
  action: z.enum(["approve", "reject"]),
});

const provisioningService = new AccessProvisioningService();

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const tourId = parseInt(id, 10);
  if (isNaN(tourId)) {
    return NextResponse.json({ error: "Invalid tour ID" }, { status: 400 });
  }

  const body = await request.json();
  const parsed = ActionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const tour = await prisma.tour.findUnique({
    where: { id: tourId },
    include: { lead: true, unit: { include: { property: true } } },
  });

  if (!tour) {
    return NextResponse.json({ error: "Tour not found" }, { status: 404 });
  }
  if (tour.status !== TourStatus.PENDING_VERIFICATION) {
    return NextResponse.json(
      { error: "Tour has already been reviewed" },
      { status: 409 }
    );
  }

  if (parsed.data.action === "reject") {
    const updated = await prisma.tour.update({
      where: { id: tourId },
      data: { status: TourStatus.REJECTED },
    });
    return NextResponse.json({ tour: updated });
  }

  // Approve: provision access then persist the code
  const result = await provisioningService.provisionForTour({
    unitId: tour.unitId,
    leadId: tour.leadId,
    scheduledAt: tour.scheduledAt,
  });

  if (!result.ok) {
    console.error("[approve] provisioning failed:", result.error.message);
    return NextResponse.json(
      { error: "Failed to provision access" },
      { status: 500 }
    );
  }

  const updated = await prisma.tour.update({
    where: { id: tourId },
    data: {
      status: TourStatus.APPROVED,
      accessCode: result.value.accessCode,
    },
  });

  // Send approval email — non-blocking, failure doesn't affect the approval
  sendApprovalConfirmation({
    to: tour.lead.email,
    fullName: tour.lead.fullName,
    propertyName: tour.unit.property.name,
    unitNumber: tour.unit.unitNumber,
    scheduledAt: tour.scheduledAt,
    accessCode: result.value.accessCode,
    publicToken: updated.publicToken,
  }).catch((err) => console.error("[email] approval confirmation failed:", err));

  return NextResponse.json({ tour: updated });
}
