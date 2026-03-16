// app/admin/employees/page.tsx
import EmployeeList from "@/components/feature/employees/admin/employee-list";
import { teamService } from "@/lib/api/admin/team.service";
import { employeeService } from "@/lib/api/employee/employee-service";
import { getCurrentUser } from "@/lib/auth/session";

export default async function EmployeesPage() {
  await getCurrentUser();

  const [employees, teams] = await Promise.all([
    employeeService.getAll(),
    teamService.getAll(),
  ]);

  return <EmployeeList employees={employees} teams={teams} />;
}
