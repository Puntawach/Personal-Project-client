import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Employee } from '@/lib/types'

type AuthState = {
  token: string | null
  employee: Employee | null
  setAuth: (token: string, employee: Employee) => void
  clearAuth: () => void
  isAdmin: () => boolean
  isSuperAdmin: () => boolean
  isLeader: () => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      employee: null,
      setAuth: (token, employee) => set({ token, employee }),
      clearAuth: () => set({ token: null, employee: null }),
      isAdmin: () => {
        const role = get().employee?.role
        return role === 'ADMIN' || role === 'SUPER_ADMIN'
      },
      isSuperAdmin: () => get().employee?.role === 'SUPER_ADMIN',
      isLeader: () => {
        const role = get().employee?.role
        return role === 'LEADER' || role === 'ADMIN' || role === 'SUPER_ADMIN'
      },
    }),
    { name: 'anc-auth' }
  )
)