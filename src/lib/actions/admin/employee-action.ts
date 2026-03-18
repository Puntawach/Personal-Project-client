"use server";

import { employeeService } from "@/lib/api/employee/employee-service";
import { revalidatePath } from "next/cache";
import { ActionResult } from "../action.type";

export const updateEmployee = async (
  id: string,
  data: Partial<{ dailyRate: number; allowancePerDay: number }>,
): Promise<ActionResult> => {
  try {
    await employeeService.update(id, data);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch {
    return { success: false, code: "UPDATE_FAILED" };
  }
};
//<{ dailyRate: number; allowancePerDay: number }>,
