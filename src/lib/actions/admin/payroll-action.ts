"use server";

import { revalidatePath } from "next/cache";
import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";
import { payrollService } from "@/lib/api/payroll/payroll-service";

export const generatePayroll = async (
  month: number,
  year: number,
): Promise<ActionResult> => {
  try {
    await payrollService.generate(month, year);
    revalidatePath("/admin/payroll");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
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
  } catch (error) {
    return formatActionError(error);
  }
};
