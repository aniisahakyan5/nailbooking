import { getProceduresList } from "@/app/actions/procedures";
import ProceduresAdmin from "@/components/admin/ProceduresAdmin";

export default async function ProceduresPage({ params }: { params: Promise<{ lang: string }> }) {
  await params;

  const procedures = await getProceduresList();
  return <ProceduresAdmin initialData={procedures} />;
}
