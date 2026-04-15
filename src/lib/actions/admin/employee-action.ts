"use server";

import { employeeService } from "@/lib/api/employee/employee-service";
import { revalidatePath } from "next/cache";
import { formatActionError } from "../action.utils";
import type { ActionResult } from "../action.type";

export const updateEmployee = async (
  id: string,
  data: Partial<{ dailyRate: number; allowancePerDay: number }>,
): Promise<ActionResult> => {
  try {
    await employeeService.update(id, data);
    revalidatePath("/admin/employees");
    return { success: true };
  } catch (error) {
    return formatActionError(error);
  }
};
