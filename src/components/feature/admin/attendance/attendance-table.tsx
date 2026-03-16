// components/features/attendance/attendance-table.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Team } from "@/lib/api/admin/team.type";
import type { AttendanceWithEmployee } from "@/lib/api/attendance/attendance.type";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useState } from "react";
import AttendanceDetailModal from "./attendance-detail-modal";
type Props = {
  initialAttendances: AttendanceWithEmployee[];
  teams: Team[];
  initialMonth: number;
  initialYear: number;
};

const statusCellStyle: Record<string, string> = {
  WORKING: "bg-blue-500/20 text-blue-400",
  SUBMITTED: "bg-amber-500/20 text-amber-400",
  APPROVED: "bg-green-500/20 text-green-400",
  REJECTED: "bg-red-500/20 text-red-400",
};

export default function AttendanceTable({
  initialAttendances,
  teams,
  initialMonth,
  initialYear,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState(initialMonth);
  const [year, setYear] = useState(initialYear);
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id ?? "");
  const [selectedAttendance, setSelectedAttendance] =
    useState<AttendanceWithEmployee | null>(null);
  const [attendances, setAttendances] =
    useState<AttendanceWithEmployee[]>(initialAttendances);
  // [LOGIC] generate days in month
  const daysInMonth = Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => new Date(year, month - 1, i + 1),
  );
  async function prevMonth() {
    const newMonth = month === 1 ? 12 : month - 1;
    const newYear = month === 1 ? year - 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    await fetchAttendances(newMonth, newYear);
  }

  async function nextMonth() {
    const newMonth = month === 12 ? 1 : month + 1;
    const newYear = month === 12 ? year + 1 : year;
    setMonth(newMonth);
    setYear(newYear);
    await fetchAttendances(newMonth, newYear);
  }

  async function fetchAttendances(m: number, y: number) {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/attendance?month=${m}&year=${y}`);
      const data = await res.json();
      setAttendances(data);
    } finally {
      setIsLoading(false);
    }
  }
  const selectedTeam = teams.find((t) => t.id === selectedTeamId);
  const teamEmployees = selectedTeam?.employees ?? [];

  // [LOGIC] find attendance — workDate stored as UTC+7 local time
  function getAttendance(employeeId: string, day: Date) {
    return attendances.find((a) => {
      const attDate = new Date(a.workDate);
      // workDate is stored in local timezone by seed
      // add 7hrs to convert UTC → UTC+7 for comparison
      const localAtt = new Date(attDate.getTime() + 7 * 60 * 60 * 1000);
      return (
        a.employeeId === employeeId &&
        localAtt.getUTCDate() === day.getDate() &&
        localAtt.getUTCMonth() === day.getMonth() &&
        localAtt.getUTCFullYear() === day.getFullYear()
      );
    });
  }

  const initials = (firstName: string, lastName: string) =>
    `${firstName[0]}${lastName[0]}`.toUpperCase();

  const monthName = new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white">Attendance Review</h1>
          <p className="text-white/40 text-sm">
            Click on any day to review or approve hours
          </p>
        </div>
        <Button
          variant="outline"
          className="gap-2 border-white/10  hover:bg-white/5"
        >
          <Download size={16} />
          Export
        </Button>
      </div>

      {/* Month Navigator */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded-xl shrink-0">
        <Button
          variant="ghost"
          onClick={prevMonth}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          <ChevronLeft size={20} />
        </Button>
        <h2 className="text-base font-bold text-white">{monthName}</h2>
        <Button
          variant="ghost"
          onClick={nextMonth}
          className="text-white/60 hover:text-white hover:bg-white/10"
        >
          <ChevronRight size={20} />
        </Button>
      </div>

      {/* Table */}
      <div className="flex-1 rounded-xl border border-white/10 overflow-hidden bg-white/5 flex flex-col">
        {/* Team header */}
        {selectedTeam && (
          <div className="border-b border-white/10 px-6 py-3 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                {selectedTeam.name[0]}
              </div>
              <div>
                <h3 className="font-bold text-white text-sm">
                  {selectedTeam.name}
                </h3>
                <p className="text-xs text-white/40">
                  {teamEmployees.length} Members
                </p>
              </div>
            </div>
            <span className="text-xs text-white/40 bg-white/5 px-2 py-1 rounded-full border border-white/10">
              Team View
            </span>
          </div>
        )}

        {/* Scrollable table */}
        <div className="overflow-auto flex-1">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="sticky top-0 z-20">
              <tr>
                <th className="sticky left-0 z-30 bg-slate-900 px-4 py-3 text-left text-xs font-bold uppercase text-white/40 border-r border-white/10 border-b border-white/10 w-48 min-w-48">
                  Employee
                </th>
                {daysInMonth.map((day) => {
                  const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                  const isToday =
                    day.toDateString() === new Date().toDateString();
                  return (
                    <th
                      key={day.toISOString()}
                      className={cn(
                        "px-1 py-2 text-center text-xs font-semibold min-w-[70px] border-r border-white/5 last:border-0 border-b border-white/10",
                        isWeekend
                          ? "bg-white/5 text-white/30"
                          : "bg-slate-900 text-white/50",
                        isToday && "bg-blue-600/20 text-blue-400",
                      )}
                    >
                      <div className="font-bold">{day.getDate()}</div>
                      <div className="text-[10px] font-normal opacity-70">
                        {day.toLocaleDateString("en-US", { weekday: "short" })}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teamEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={daysInMonth.length + 1}
                    className="py-12 text-center text-white/30"
                  >
                    No employees in this team
                  </td>
                </tr>
              ) : (
                teamEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    <td className="sticky left-0 z-10 bg-slate-900 px-4 py-3 border-r border-white/10">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7 shrink-0">
                          <AvatarImage src={emp.avatarUrl ?? undefined} />
                          <AvatarFallback className="bg-blue-600 text-white text-[10px] font-bold">
                            {initials(emp.firstName, emp.lastName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-white truncate">
                            {emp.firstName} {emp.lastName}
                          </p>
                        </div>
                      </div>
                    </td>

                    {daysInMonth.map((day) => {
                      const att = getAttendance(emp.id, day);
                      const isWeekend =
                        day.getDay() === 0 || day.getDay() === 6;
                      return (
                        <td
                          key={day.toISOString()}
                          className={cn(
                            "px-1 py-0 text-center align-middle h-12 min-w-[70px] border-r border-white/5 last:border-0 transition-colors",
                            att ? "cursor-pointer hover:bg-white/10" : "",
                            isWeekend && "bg-white/[0.02]",
                          )}
                          onClick={() => att && setSelectedAttendance(att)}
                        >
                          {att ? (
                            <div className="flex flex-col items-center justify-center h-full gap-0.5">
                              <span
                                className={cn(
                                  "text-xs font-bold px-1.5 py-0.5 rounded-md",
                                  statusCellStyle[att.status],
                                )}
                              >
                                {att.totalHours.toFixed(1)}h
                              </span>
                              {att.otHours > 0 && (
                                <span className="text-[10px] text-amber-400">
                                  OT {att.otHours.toFixed(1)}h
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-white/10 text-xs">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Team tabs */}
        <div className="border-t border-white/10 bg-black/20 px-2 py-2 shrink-0 overflow-x-auto">
          <div className="flex items-center gap-1 min-w-max">
            {teams.map((team) => {
              const isActive = team.id === selectedTeamId;
              return (
                <button
                  key={team.id}
                  onClick={() => setSelectedTeamId(team.id)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-white/40 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded flex items-center justify-center text-xs font-bold",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-white/50",
                    )}
                  >
                    {team.name[0]}
                  </div>
                  {team.name}
                  <span
                    className={cn(
                      "text-xs",
                      isActive ? "text-white/60" : "text-white/20",
                    )}
                  >
                    {team.employees?.length ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <AttendanceDetailModal
        attendance={selectedAttendance}
        onClose={() => setSelectedAttendance(null)}
        onAction={() => {
          setSelectedAttendance(null);
          fetchAttendances(month, year); // ← fetch ใหม่เลย
        }}
      />
    </div>
  );
}
