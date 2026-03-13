import { api } from '@/lib/api/auth'
import type { Employee, ApiResponse } from '@/lib/types'
import type { CreateEmployeeInput } from '@/lib/schemas/employee.schema'

export async function createEmployee(payload: CreateEmployeeInput): Promise<Employee> {
  const res = await api.post<ApiResponse<Employee>>('/employees', payload)
  return res.data.data
}

// export async function getEmployees(): Promise<Employee[]> {
//   const res = await api.get<ApiResponse<Employee[]>>('/employees')
//   return res.data.data
// }

// export async function getEmployee(id: string): Promise<Employee> {
//   const res = await api.get<ApiResponse<Employee>>(`/employees/${id}`)
//   return res.data.data
// }

// export async function deleteEmployee(id: string): Promise<void> {
//   await api.delete(`/employees/${id}`)
// }
