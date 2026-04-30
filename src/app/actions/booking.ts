"use server";

import { db } from "@/lib/db";
import { addMinutes, format, isAfter, isBefore, startOfDay, endOfDay, setHours, setMinutes } from "date-fns";

export async function getProcedures() {
  return await db.procedure.findMany();
}

export async function getAvailableSlots(date: Date, procedureIds: string[]) {
  // 1. Get procedures to calculate total duration
  const procedures = await db.procedure.findMany({
    where: { id: { in: procedureIds } }
  });
  
  const totalDuration = procedures.reduce((acc: number, curr: any) => acc + curr.duration, 0);
  const buffer = 5; // 5 minute buffer as requested
  
  // 2. Get existing bookings for that day
  const bookings = await db.booking.findMany({
    where: {
      startTime: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      status: { not: "CANCELLED" }
    },
    orderBy: { startTime: "asc" }
  });

  // 3. Generate slots from 9 AM to 8 PM (Salon hours)
  const slots = [];
  let currentSlot = setMinutes(setHours(startOfDay(date), 9), 0);
  const dayEnd = setMinutes(setHours(startOfDay(date), 20), 0);

  while (isBefore(currentSlot, dayEnd)) {
    const slotEnd = addMinutes(currentSlot, totalDuration);
    
    // Check if slot overlaps with any existing booking
    const isOverlap = bookings.some(b => {
      return (
        (isAfter(slotEnd, b.startTime) && isBefore(currentSlot, b.endTime)) ||
        (currentSlot.getTime() === b.startTime.getTime())
      );
    });

    slots.push({
      time: format(currentSlot, "HH:mm"),
      available: !isOverlap && isBefore(slotEnd, dayEnd),
      dateTime: currentSlot
    });

    // Next slot starts after previous ends + buffer
    // Actually, the user says "others can see the time but it should be unavailable"
    // And "second client can take time slot + 1 hour and 5min"
    // So if someone takes 2:00 PM for 1h, the next available is 3:05 PM.
    // For the UI, we can show fixed intervals or dynamic gaps.
    // Let's use 15-min intervals for selection, but validate against bookings + buffer.
    currentSlot = addMinutes(currentSlot, 15);
  }

  return slots;
}

export async function createBooking(data: {
  userId: string;
  procedureIds: string[];
  startTime: Date;
}) {
  const procedures = await db.procedure.findMany({
    where: { id: { in: data.procedureIds } }
  });
  
  const totalDuration = procedures.reduce((acc, curr) => acc + curr.duration, 0);
  const endTime = addMinutes(data.startTime, totalDuration);

  // Re-verify availability
  const conflict = await db.booking.findFirst({
    where: {
      startTime: { lte: endTime },
      endTime: { gte: data.startTime },
      status: { not: "CANCELLED" }
    }
  });

  if (conflict) throw new Error("Slot already taken");

  // Create individual bookings for each procedure or one combined?
  // Let's create one booking record per session for simplicity.
  return await db.booking.create({
    data: {
      userId: data.userId,
      procedureId: data.procedureIds[0], // For now, link to first one
      startTime: data.startTime,
      endTime: endTime,
      status: "CONFIRMED"
    }
  });
}
