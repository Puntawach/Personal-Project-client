import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8000',
})

export type LoginPayload = {
  email: string
  password: string
}

export type Employee = {
  id: string
  email: string
  firstName: string
  lastName: string
  dailyRate: number | null
  allowancePerDay: number | null
  phoneNumber: string
  address: string
  identificationId: number
  role: 'WORKER' | 'LEADER' | 'ADMIN' | 'SUPER_ADMIN'
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED'
  avatarUrl: string | null
  teamId: string | null
  createdAt: string
  updatedAt: string
}

export type LoginResponse = {
  accessToken: string
  employee: Employee
}

type ApiResponse<T> = {
  success: boolean
  data: T
  path: string
  timestamp: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', payload)
  return res.data.data
}