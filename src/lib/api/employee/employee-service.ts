import { api } from "@/lib/api/client";
import { Employee } from "@/lib/api/employee/employee.type";

const getMe = () => api.get<Employee>("/employees/me");

const getAll = () => api.get<Employee[]>("/employees");

const getById = (id: string) => api.get<Employee>(`/employees/${id}`);

const create = (data: Partial<Employee>) =>
  api.post<Employee>("/employees", data);

const update = (id: string, data: Partial<Employee>) =>
  api.patch<Employee>(`/employees/${id}`, data);

const updateMe = (data: Partial<Employee>) =>
  api.patch<Employee>("/employees/me", data);

const deleteEmployee = (id: string) => api.delete<void>(`/employees/${id}`);

const uploadAvatar = (input: FormData) =>
  api.patch<string>("/employees/me/avatar", input);

export const employeeService = {
  getMe,
  getAll,
  getById,
  create,
  update,
  updateMe,
  deleteEmployee,
  uploadAvatar,
};
