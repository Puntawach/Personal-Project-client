// lib/actions/attendance.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { ActionResult } from "../action.type";
import { attendanceService } from "@/lib/api/attendance/attendance-service";

export const approve = async (attendanceId: string): Promise<ActionResult> => {
  try {
    await attendanceService.approve(attendanceId);
    revalidatePath("/admin/attendance");
    return { success: true };
  } catch {
    return { success: false, code: "APPROVE_FAILED" };
  }
};

export const reject = async (attendanceId: string): Promise<ActionResult> => {
  try {
    await attendanceService.reject(attendanceId);
    revalidatePath("/admin/attendance");
    return { success: true };
  } catch {
    return { success: false, code: "REJECT_FAILED" };
  }
};
