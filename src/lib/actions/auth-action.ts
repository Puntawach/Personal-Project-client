"use server";

import { redirect } from "next/navigation";
import { signIn, auth, signOut } from "../auth/auth";
import { LoginInputForm } from "../schemas/auth.schema";
import { ActionResult } from "./action.type";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

export const login = async (input: LoginInputForm): Promise<ActionResult> => {
  try {
    console.log("before login");
    await signIn("credentials", { ...input, redirect: false });
    console.log("after login");
  } catch {
    return { success: false, code: "INVALID_CREDENTIALS" };
  }

  // ดึง session หลัง login สำเร็จ
  const session = await auth();
  const role = session?.user?.role ?? "WORKER";
  const isAdmin = ADMIN_ROLES.includes(role);

  // redirect ตาม role
  redirect(isAdmin ? "/admin" : "/home");
};
export const logout = async () => {
  await signOut({ redirectTo: "/login" });
};
