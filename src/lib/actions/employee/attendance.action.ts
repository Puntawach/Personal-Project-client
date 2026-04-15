"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "@/lib/actions/action.utils";
import type { ActionResult } from "@/lib/actions/action.type";
import type { Attendance, Site } from "@/lib/types";
import { attendanceService } from "@/lib/api/attendance/attendance.service";
import { siteService } from "@/lib/api/site/site.service";

export async function getSitesAction(): Promise<ActionResult<Site[]>> {
  try {
    const data = await siteService.getAll();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function getMyAttendanceAction(): Promise<
  ActionResult<Attendance[]>
> {
  try {
    const data = await attendanceService.getMyAttendance();
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}

export async function checkInAction(
  siteId: string,
  workDate: string,
  checkInTime: string,
): Promise<ActionResult<Attendance>> {
  try {
    const data = await attendanceService.checkIn({
      siteId,
      workDate,
      checkInTime,
    });
    revalidatePath("/attendance");
    revalidatePath("/admin/attendance");
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}
export async function checkOutAction(
  attendanceId: string,
  checkOutTime: string,
  workDescription?: string,
  issues?: string,
): Promise<ActionResult<Attendance>> {
  try {
    const data = await attendanceService.checkOut(attendanceId, {
      checkOutTime,
      workDescription,
      issues,
    });
    revalidatePath("/attendance");
    revalidatePath("/admin/attendance");
    return { success: true, data };
  } catch (error) {
    return formatActionError(error);
  }
}
