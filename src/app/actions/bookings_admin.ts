"use server";

import { db } from "@/lib/db";
import { startOfDay, endOfDay } from "date-fns";

export async function getBookingsByDate(date: Date) {
  return await db.booking.findMany({
    where: {
      startTime: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      }
    },
    include: {
      user: true,
      procedure: true
    },
    orderBy: { startTime: "asc" }
  });
}
