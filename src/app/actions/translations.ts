"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getTranslationsList() {
  return await db.translation.findMany({
    orderBy: { createdAt: "desc" }
  });
}

export async function upsertTranslation(data: { key: string; en: string; ru: string; hy: string }) {
  await db.translation.upsert({
    where: { key: data.key },
    update: { en: data.en, ru: data.ru, hy: data.hy },
    create: { key: data.key, en: data.en, ru: data.ru, hy: data.hy }
  });
  revalidatePath("/admin/translations");
}

export async function deleteTranslation(key: string) {
  await db.translation.delete({ where: { key } });
  revalidatePath("/admin/translations");
}
