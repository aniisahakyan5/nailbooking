import { getEmployeesList } from "@/app/actions/employees";
import EmployeesAdmin from "@/components/admin/EmployeesAdmin";

export default async function EmployeesPage() {
  const employees = await getEmployeesList();
  return <EmployeesAdmin initialData={employees} />;
}
