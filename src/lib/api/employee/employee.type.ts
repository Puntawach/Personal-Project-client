export type Status = "ACTIVE" | "INACTIVE" | "DELETED";

export type Role = "WORKER" | "LEADER" | "ADMIN" | "SUPER_ADMIN";

export type Employee = {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
  identificationId: number;
  role: "WORKER" | "LEADER" | "ADMIN" | "SUPER_ADMIN";
  status: "ACTIVE" | "INACTIVE" | "DELETE";
  avatarUrl: string | null;
  dailyRate: number;
  allowancePerDay: number | null;
  createdAt: string;
  updatedAt: string;
  teamId: string | null;
};

export type UpdateMeInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};
