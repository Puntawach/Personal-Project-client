"use server";

import { LoginInputForm } from "../schemas/auth.schema";
import { ActionResult } from "./action.type";

export const login = async (input: LoginInputForm): Promise<ActionResult> => {
  const res = await fetch("http://localhost:8000/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
    headers: { "content-type": "application/json" },
  });

  // failed
  if (!res.ok) {
    // handle error
    const error = await res.json();
  } else {
    const result = await res.json();
  } // success

  return "s";
};
