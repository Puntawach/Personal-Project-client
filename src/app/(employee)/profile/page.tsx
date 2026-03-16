// app/(employee)/profile/page.tsx
import ProfileHeader from "@/components/feature/employees/profile/profile-header";
import { employeeService } from "@/lib/api/employee/employee-service";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ProfilePage() {
  await getCurrentUser();
  const employee = await employeeService.getMe();

  return (
    <div>
      <ProfileHeader employee={employee} />
    </div>
  );
}
