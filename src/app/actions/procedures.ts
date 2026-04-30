"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getProceduresList() {
  return await db.procedure.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function createProcedure(data: { 
  name: string; 
  duration: number; 
  price: number;
  translations: { en: string; ru: string; hy: string }
}) {
  // 1. Generate a key based on the English name
  const nameKey = `proc_${data.name.toLowerCase().replace(/\s+/g, '_')}`;

  // 2. Create translations
  await db.translation.create({
    data: {
      key: nameKey,
      en: data.translations.en,
      ru: data.translations.ru,
      hy: data.translations.hy
    }
  });

  // 3. Create procedure
  await db.procedure.create({
    data: {
      nameKey: nameKey,
      duration: data.duration,
      price: data.price
    }
  });

  revalidatePath("/admin/procedures");
}

export async function deleteProcedure(id: string, nameKey: string) {
  await db.procedure.delete({ where: { id } });
  await db.translation.delete({ where: { key: nameKey } });
  revalidatePath("/admin/procedures");
}
