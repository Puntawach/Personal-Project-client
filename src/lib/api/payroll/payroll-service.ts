// lib/api/payroll/payroll.service.ts
import { api } from "@/lib/api/client";
import { PayrollItem, PayrollPeriod, PayrollSummary } from "./payroll-type";

const generate = (month: number, year: number) =>
  api.post<{ period: PayrollPeriod; payrollItems: PayrollItem[] }>(
    "/payroll/generate",
    { month, year },
  );

const lock = (month: number, year: number) =>
  api.post<PayrollPeriod>("/payroll/lock", { month, year });

const getSummary = (month: number, year: number) =>
  api.get<PayrollSummary>(`/payroll/summary?month=${month}&year=${year}`);

const getMyPayroll = (month: number, year: number) =>
  api.get<PayrollItem>(`/payroll/me?month=${month}&year=${year}`);

export const payrollService = {
  generate,
  lock,
  getSummary,
  getMyPayroll,
};
