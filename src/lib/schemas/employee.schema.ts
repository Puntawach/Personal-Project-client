import { z } from "zod";

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  identificationId: z.coerce
    .number({ invalid_type_error: "ID must be a number" })
    .min(1, "ID number is required"),
  role: z.enum(["WORKER", "LEADER", "ADMIN", "SUPER_ADMIN"], {
    required_error: "Role is required",
  }),
  dailyRate: z.coerce.number().optional(),
  allowancePerDay: z.coerce.number().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
