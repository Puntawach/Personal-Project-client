// app/admin/employees/page.tsx
import EmployeeList from "@/components/feature/employees/admin/employee-list";
import { teamService } from "@/lib/api/admin/team.service";
import { employeeService } from "@/lib/api/employee/employee-service";


export default async function EmployeesPage() {
  const employees = await employeeService.getAllEmployee();
  const teams = await teamService.getAll();

  return <EmployeeList employees={employees} teams={teams} />;
}
