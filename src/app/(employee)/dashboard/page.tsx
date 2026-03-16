import DashboardContent from "@/components/feature/employees/home/dashboard-content";
import { employeeService } from "@/lib/api/employee/employee-service";
import { getCurrentUser } from "@/lib/auth/session";

// page.tsx
export default async function HomePage() {
  await getCurrentUser();
  const employee = await employeeService.getMe();

  return <DashboardContent employee={employee} />;
}
