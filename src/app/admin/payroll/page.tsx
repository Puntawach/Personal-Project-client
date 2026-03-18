// app/admin/payroll/page.tsx
import { getCurrentUser } from "@/lib/auth/session";
import { teamService } from "@/lib/api/admin/team.service";
import { payrollService } from "@/lib/api/payroll/payroll-service";
import PayrollTable from "@/components/feature/admin/payroll/payroll-table";

export default async function PayrollPage() {
  await getCurrentUser();

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const [teams] = await Promise.all([teamService.getAll()]);

  // [NOTE] payroll summary อาจไม่มีถ้ายังไม่ generate
  let summary = null;
  try {
    summary = await payrollService.getSummary(month, year);
  } catch {
    summary = null;
  }

  return (
    <PayrollTable summary={summary} teams={teams} month={month} year={year} />
  );
}
