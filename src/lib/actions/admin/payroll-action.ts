// lib/actions/admin/payroll.action.ts
"use server";

import { revalidatePath } from "next/cache";
import { ActionResult } from "../action.type";
import { payrollService } from "@/lib/api/payroll/payroll-service";

export const generatePayroll = async (
  month: number,
  year: number,
): Promise<ActionResult> => {
  try {
    await payrollService.generate(month, year);
    revalidatePath("/admin/payroll");
    return { success: true };
  } catch {
    return { success: false, code: "GENERATE_FAILED" };
  }
};

export const lockPayroll = async (
  month: number,
  year: number,
): Promise<ActionResult> => {
  try {
    await payrollService.lock(month, year);
    revalidatePath("/admin/payroll");
    return { success: true };
  } catch {
    return { success: false, code: "LOCK_FAILED" };
  }
};
