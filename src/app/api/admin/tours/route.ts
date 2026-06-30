import { prisma } from "@/lib/db/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as { role?: string } | undefined)?.role;
  if (role !== "manager") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const tours = await prisma.tour.findMany({
    where: { status: "PENDING_VERIFICATION" },
    orderBy: { createdAt: "asc" },
    include: {
      lead: true,
      unit: { include: { property: true } },
    },
  });

  return NextResponse.json({ tours });
}
