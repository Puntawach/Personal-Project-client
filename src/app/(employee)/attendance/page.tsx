import { getMyAttendanceAction } from "@/lib/actions/employee/attendance.action";
import { toDateKey, todayKey } from "@/lib/utils/date";
import type { Attendance } from "@/lib/types";
import AttendanceTodayCard from "@/components/feature/employees/attendance/attendance-today-card";
import AttendanceCard from "@/components/feature/employees/attendance/attendance-card";

export default async function AttendanceEmployeePage() {
  const result = await getMyAttendanceAction();
  const attendances: Attendance[] = result.success ? (result.data ?? []) : [];
  console.log("key", todayKey());
  console.log(
    "workDates",
    attendances.map((a) => ({
      raw: a.workDate,
      key: toDateKey(a.workDate),
    })),
  );
  const key = todayKey();
  const todayAttendance =
    attendances.find((a) => toDateKey(a.workDate) === key) ?? null;

  const pastAttendances = attendances
    .filter((a) => toDateKey(a.workDate) !== key)
    .sort(
      (a, b) => new Date(b.workDate).getTime() - new Date(a.workDate).getTime(),
    );

  return (
    <div className="space-y-6 pb-8">
      <div>
        <h1 className="text-lg font-bold text-gray-800">บันทึกการทำงาน</h1>
        <p className="text-xs text-muted-foreground">ประวัติการเข้า-ออกงาน</p>
      </div>

      <AttendanceTodayCard todayAttendance={todayAttendance} />

      <div className="space-y-3">
        <h2 className="text-sm font-semibold text-gray-600">
          ประวัติที่ผ่านมา
        </h2>
        {pastAttendances.length === 0 ? (
          <div className="text-center py-12 text-sm text-muted-foreground">
            ยังไม่มีประวัติการทำงาน
          </div>
        ) : (
          <div className="space-y-2">
            {pastAttendances.map((attendance) => (
              <AttendanceCard key={attendance.id} attendance={attendance} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
