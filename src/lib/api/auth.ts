import axios from 'axios'
import type { Employee, ApiResponse } from '@/lib/types'

export const api = axios.create({
  baseURL: 'http://localhost:8000',
})

// Attach token to every request
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  employee: Employee
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const res = await api.post<ApiResponse<LoginResponse>>('/auth/login', payload)
  const { accessToken, employee } = res.data.data

  // Store token for both middleware (cookie) and axios interceptor (localStorage)
  localStorage.setItem('token', accessToken)
  document.cookie = `token=${accessToken}; path=/; max-age=${60 * 60 * 24 * 7}`

  return { accessToken, employee }
}

export function logout() {
  localStorage.removeItem('token')
  document.cookie = 'token=; path=/; max-age=0'
}