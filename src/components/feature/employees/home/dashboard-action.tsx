import { Employee } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CalendarDays, FileText, LogIn, User } from "lucide-react";
import Link from "next/link";
const mockToday = {
  isCheckedIn: false,
  checkInTime: null,
  site: "Downtown Mall Project",
  team: "Alpha Squad",
  workedHours: 0,
};

type Props = {
  employee: Employee;
};

export default function DashboardActions({ employee }: Props) {
  // [API] GET /attendance/me → filter today
  // [API] GET /attendance/me → last 3 for recent list
  const today = mockToday;
  return (
    <div className="grid grid-cols-2 gap-3">
      {/*  */}
      <Link href={today.isCheckedIn ? "/attendance/check-out" : "/attendance"}>
        <div
          className={cn(
            "rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 transition-all active:scale-95",
            today.isCheckedIn
              ? "bg-red-500 text-white"
              : "bg-blue-600 text-white",
          )}
        >
          <LogIn size={28} />
          <p className="font-semibold text-sm">
            {today.isCheckedIn ? "Check Out" : "Check In"}
          </p>
        </div>
      </Link>
      {/* Daily Report */}
      <Link href="/reports/create">
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 border border-gray-100 transition-all active:scale-95">
          <FileText size={28} className="text-gray-600" />
          <div className="text-center">
            <p className="font-semibold text-sm text-gray-800">Daily Report</p>
            <p className="text-[10px] text-amber-500 font-medium">PENDING</p>
          </div>
        </div>
      </Link>

      {/* My Calendar */}
      <Link href="/dashboard">
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 border border-gray-100 transition-all active:scale-95">
          <CalendarDays size={28} className="text-gray-600" />
          <p className="font-semibold text-sm text-gray-800">My Calendar</p>
        </div>
      </Link>

      {/* My Profile */}
      <Link href="/profile">
        <div className="bg-white rounded-2xl p-5 flex flex-col items-center justify-center gap-2 h-28 border border-gray-100 transition-all active:scale-95">
          <User size={28} className="text-gray-600" />
          <p className="font-semibold text-sm text-gray-800">My Profile</p>
        </div>
      </Link>
    </div>
  );
}
