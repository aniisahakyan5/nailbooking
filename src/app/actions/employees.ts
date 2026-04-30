"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getEmployeesList() {
  return await db.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPERADMIN"] }
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function updateEmployeeRole(id: string, role: "ADMIN" | "SUPERADMIN" | "CLIENT") {
  await db.user.update({
    where: { id },
    data: { role }
  });
  revalidatePath("/admin/employees");
}

export async function createEmployee(data: { name: string; surname: string; email: string; phone: string; role: any }) {
  // In a real app, you'd send an invite email or set a temp password
  await db.user.create({
    data: {
      name: data.name,
      surname: data.surname,
      email: data.email,
      phone: data.phone,
      role: data.role,
      password: "temporary-password" // Should be handled better
    }
  });
  revalidatePath("/admin/employees");
}
