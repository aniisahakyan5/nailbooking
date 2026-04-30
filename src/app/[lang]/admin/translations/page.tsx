import { getTranslationsList } from "@/app/actions/translations";
import TranslationsTable from "@/components/admin/TranslationsTable";

export default async function TranslationsPage({ params }: { params: Promise<{ lang: string }> }) {
  await params;

  const translations = await getTranslationsList();
  
  return (
    <TranslationsTable initialData={translations} />
  );
}
