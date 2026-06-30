import { prisma } from "@/lib/db/prisma";
import { sendBookingConfirmation } from "@/lib/email/mailer";
import { TourStatus } from "@/lib/types/tour";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BookingSchema = z.object({
  tourSlotId: z.number().int().positive(),
  fullName: z.string().min(1).max(100),
  email: z.string().email(),
  phoneNumber: z.string().min(7).max(20),
});

export async function GET() {
  const tourSlots = await prisma.tourSlot.findMany({
    where: { isAvailable: true, startTime: { gte: new Date() } },
    orderBy: { startTime: "asc" },
    include: { unit: { include: { property: true } } },
  });
  return NextResponse.json({ tourSlots });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = BookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid request", issues: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { tourSlotId, fullName, email, phoneNumber } = parsed.data;

    // Verify tour slot exists and is available
    const tourSlot = await prisma.tourSlot.findUnique({ where: { id: tourSlotId } });
    if (!tourSlot) {
      return NextResponse.json(
        { error: "Tour slot not found" },
        { status: 404 }
      );
    }
    if (!tourSlot.isAvailable) {
      return NextResponse.json(
        { error: "Tour slot is no longer available" },
        { status: 409 }
      );
    }

    // Booking is atomic: find-or-create the lead, claim the slot, and create the
    // tour all together, or none of it happens.
    // accessCode is intentionally not set here — it is only generated once a manager
    // approves the tour (see AccessProvisioningService).
    const tour = await prisma.$transaction(async (tx) => {
      const lead = await tx.lead.upsert({
        where: { email },
        update: { fullName, phoneNumber },
        create: { email, fullName, phoneNumber },
      });

      const updated = await tx.tourSlot.updateMany({
        where: { id: tourSlotId, isAvailable: true },
        data: { isAvailable: false },
      });
      if (updated.count === 0) {
        throw new Error("SLOT_TAKEN");
      }

      return tx.tour.create({
        data: {
          scheduledAt: tourSlot.startTime,
          status: TourStatus.PENDING_VERIFICATION,
          unitId: tourSlot.unitId,
          tourSlotId,
          leadId: lead.id,
        },
      });
    });

    // Send confirmation email — non-blocking, failure doesn't affect the booking
    const slot = await prisma.tourSlot.findUnique({
      where: { id: tourSlotId },
      include: { unit: { include: { property: true } } },
    });
    if (slot) {
      sendBookingConfirmation({
        to: email,
        fullName,
        propertyName: slot.unit.property.name,
        unitNumber: slot.unit.unitNumber,
        scheduledAt: slot.startTime,
        publicToken: tour.publicToken,
      }).catch((err) => console.error("[email] booking confirmation failed:", err));
    }

    return NextResponse.json({ success: true, tour: { publicToken: tour.publicToken } }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "SLOT_TAKEN") {
      return NextResponse.json(
        { error: "Tour slot is no longer available" },
        { status: 409 }
      );
    }
    console.error("Error booking tour:", error);
    return NextResponse.json(
      { error: "Failed to book tour" },
      { status: 500 }
    );
  }
}