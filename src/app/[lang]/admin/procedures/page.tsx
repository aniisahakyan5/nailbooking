import { getProceduresList } from "@/app/actions/procedures";
import ProceduresAdmin from "@/components/admin/ProceduresAdmin";

export default async function ProceduresPage() {
  const procedures = await getProceduresList();
  return <ProceduresAdmin initialData={procedures} />;
}
