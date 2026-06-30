import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PROPERTIES = [
  {
    name: "Maple Court Apartments",
    address: "123 Maple St, Springfield, IL",
    units: ["1A", "2B", "3C"],
  },
  {
    name: "Riverside Lofts",
    address: "450 River Rd, Chicago, IL",
    units: ["101", "202", "303"],
  },
  {
    name: "Sunset View Residences",
    address: "789 Sunset Blvd, Naperville, IL",
    units: ["A1", "B2"],
  },
];

// 9 AM–5 PM slots every 30 minutes on weekdays
const SLOT_HOURS = [9, 10, 11, 13, 14, 15, 16];

function nextWeekdays(count: number): Date[] {
  const days: Date[] = [];
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);
  cursor.setDate(cursor.getDate() + 1);

  while (days.length < count) {
    const dow = cursor.getDay();
    if (dow !== 0 && dow !== 6) days.push(new Date(cursor));
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

async function main() {
  let totalSlots = 0;

  for (const p of PROPERTIES) {
    const property = await prisma.property.create({
      data: { name: p.name, address: p.address },
    });

    for (const unitNumber of p.units) {
      const unit = await prisma.unit.create({
        data: { unitNumber, propertyId: property.id },
      });

      // Spread slots across the next 5 weekdays per unit
      const weekdays = nextWeekdays(5);

      for (const day of weekdays) {
        for (const hour of SLOT_HOURS) {
          const startTime = new Date(day);
          startTime.setHours(hour, 0, 0, 0);
          const endTime = new Date(startTime);
          endTime.setMinutes(30);

          await prisma.tourSlot.create({
            data: { unitId: unit.id, startTime, endTime, isAvailable: true },
          });
          totalSlots++;
        }
      }
    }

    console.log(`Seeded "${property.name}" with ${p.units.length} unit(s).`);
  }

  console.log(`\nTotal tour slots created: ${totalSlots}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
