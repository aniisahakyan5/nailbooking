import { db } from "./db";

export type Locale = "en" | "ru" | "hy";

export async function getTranslations(lang: Locale) {
  const translations = await db.translation.findMany();
  const dict: Record<string, string> = {};
  
  translations.forEach((t) => {
    dict[t.key] = (t as any)[lang] || (t as any)["en"] || t.key;
  });
  
  return dict;
}

export async function getTranslation(key: string, lang: Locale) {
  const translation = await db.translation.findUnique({
    where: { key },
  });
  
  if (!translation) return key;
  return (translation as any)[lang] || (translation as any)["en"] || key;
}

export async function getDefaultLanguage() {
  const lang = await db.language.findFirst({
    where: { isDefault: true },
  });
  return (lang?.code as Locale) || "hy";
}
