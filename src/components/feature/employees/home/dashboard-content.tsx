// dashboard-content.tsx
"use client"; // ← ถ้าต้องการ state

type Props = {
  employee: Employee;
};
import { cn } from "@/lib/utils";
import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  LogIn,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";
import DashboardHeader from "./dashboard-header";
import { Employee } from "@/lib/types";
import DashboardCardStatus from "./dashboard-cardStatus";
import DashboardUpdate from "./dashboard-update";
import DashboardActions from "./dashboard-action";

const mockRecentAttendance = [
  {
    id: "1",
    date: "Sat, Mar 14",
    site: "Downtown Mall",
    hours: 8,
    ot: 1,
    status: "PENDING",
  },
  {
    id: "2",
    date: "Fri, Mar 13",
    site: "Downtown Mall",
    hours: 9,
    ot: 0,
    status: "APPROVED",
  },
  {
    id: "3",
    date: "Thu, Mar 12",
    site: "Downtown Mall",
    hours: 8,
    ot: 0,
    status: "APPROVED",
  },
];

const statusStyle: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  WORKING: "bg-blue-100 text-blue-700",
};
export default function DashboardContent({ employee }: Props) {
  // เอา UI ทั้งหมดจาก page.tsx มาไว้ตรงนี้
  // เปลี่ยน mockEmployee → employee
  // [AUTH] const session = await auth()
  // [AUTH] const employee = session?.user

  // [API] GET /attendance/me → filter today
  // [API] GET /attendance/me → last 3 for recent list

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* ── Header ───────────────────────────────────────────────────────── */}
      <DashboardHeader employee={employee} />
      {/* ── Today Status Card ─────────────────────────────────────────────── */}
      <DashboardCardStatus employee={employee} />
      {/* ── Quick Actions ─────────────────────────────────────────────────── */}
      <DashboardActions employee={employee} />
      {/* ── Today's Updates ───────────────────────────────────────────────── */}
      <DashboardUpdate employee={employee} />

      {/* ── Recent Attendance ─────────────────────────────────────────────── */}
      <div className="space-y-2 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Recent Attendancessss
          </h2>
          <Link
            href="/attendance"
            className="text-xs text-blue-600 font-medium flex items-center gap-0.5"
          >
            View all <ChevronRight size={12} />
          </Link>
        </div>
        <div className="space-y-2">
          {mockRecentAttendance.map((att) => (
            <div
              key={att.id}
              className="bg-white rounded-xl px-4 py-3 flex items-center justify-between border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {att.date}
                  </p>
                  <p className="text-xs text-gray-400">{att.site}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">
                  {att.hours}h
                </p>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full",
                    statusStyle[att.status],
                  )}
                >
                  {att.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
