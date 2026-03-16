export type Status = "ACTIVE" | "INACTIVE" | "DELETED";

export type Role = "WORKER" | "LEADER" | "ADMIN" | "SUPER_ADMIN";

export type Employee = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dailyRate: number;
  allowancePerDay: number;
  phoneNumber: string;
  address: string;
  identificationId: number;
  role: Role;
  status: Status;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  teamId: string;
};

export type UpdateMeInput = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  address: string;
};
