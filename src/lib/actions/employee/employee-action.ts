"use server";

import { employeeService } from "@/lib/api/employee/employee-service";
import { UpdateMeInput } from "@/lib/api/employee/employee.type";
import { revalidatePath } from "next/cache";
import { ActionResult } from "../action.type";

export const updateMe = async (data: UpdateMeInput): Promise<ActionResult> => {
  try {
    await employeeService.updateMe(data);
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { success: false, code: "UPDATE_FAILED" };
  }
};

export const uploadAvatar = async (file: File): Promise<ActionResult> => {
  const formData = new FormData();
  formData.append("avatar", file);
  try {
    await employeeService.uploadAvatar(formData);
    revalidatePath("/profile");
    return { success: true };
  } catch {
    return { success: false, code: "UPLOAD_FAILED" };
  }
};
