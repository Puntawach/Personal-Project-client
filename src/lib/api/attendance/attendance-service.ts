// lib/api/attendance/attendance.service.ts
import { api } from "@/lib/api/client";
import { Attendance } from "@/lib/types";
import { AttendanceWithEmployee } from "./attendance.type";

const getMyAttendance = () => api.get<Attendance[]>("/attendance/me");

const getByEmployee = (employeeId: string) =>
  api.get<Attendance[]>(`/attendance/employee/${employeeId}`);

const approve = (attendanceId: string) =>
  api.patch<Attendance>(`/attendance/${attendanceId}/approve`);

const reject = (attendanceId: string) =>
  api.patch<Attendance>(`/attendance/${attendanceId}/reject`);

// lib/api/attendance/attendance.service.ts
const getAllByMonth = (month: number, year: number) =>
  api.get<AttendanceWithEmployee[]>(
    `/attendance/admin/all?month=${month}&year=${year}`,
  );
export const attendanceService = {
  getMyAttendance,
  getByEmployee,
  getAllByMonth,
  approve,
  reject,
};
