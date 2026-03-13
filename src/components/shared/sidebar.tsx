'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/lib/stores/auth.store'
import { logout } from '@/lib/api/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  LayoutDashboard,
  ClipboardCheck,
  FileText,
  DollarSign,
  Users,
  MapPin,
  UsersRound,
  LogOut,
} from 'lucide-react'
import type { Role } from '@/lib/types'

type NavItem = {
  label: string
  href: string
  icon: React.ReactNode
  roles?: Role[]
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: <LayoutDashboard size={18} /> },
  { label: 'Attendance', href: '/attendance', icon: <ClipboardCheck size={18} /> },
  { label: 'Reports', href: '/reports', icon: <FileText size={18} /> },
  { label: 'Payroll', href: '/payroll', icon: <DollarSign size={18} /> },
  { label: 'Teams', href: '/teams', icon: <UsersRound size={18} />, roles: ['LEADER', 'ADMIN', 'SUPER_ADMIN'] },
  { label: 'Employees', href: '/employees', icon: <Users size={18} />, roles: ['ADMIN', 'SUPER_ADMIN'] },
  { label: 'Sites', href: '/sites', icon: <MapPin size={18} />, roles: ['ADMIN', 'SUPER_ADMIN'] },
]

const roleBadgeVariant: Record<Role, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  WORKER: 'secondary',
  LEADER: 'outline',
  ADMIN: 'default',
  SUPER_ADMIN: 'destructive',
}

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { employee, clearAuth } = useAuthStore()

  function handleLogout() {
    logout()
    clearAuth()
    router.push('/login')
  }

  const visibleItems = navItems.filter(
    (item) => !item.roles || (employee?.role && item.roles.includes(employee.role))
  )

  const initials = employee
    ? `${employee.firstName[0]}${employee.lastName[0]}`.toUpperCase()
    : '??'

  return (
    <aside className="flex flex-col w-64 min-h-screen bg-white border-r">
      {/* Logo */}
      <div className="px-6 py-5">
        <h1 className="text-xl font-bold tracking-tight">ANC</h1>
        <p className="text-xs text-muted-foreground">Workforce Management</p>
      </div>

      <Separator />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>

      <Separator />

      {/* User profile */}
      <div className="px-4 py-4 space-y-3">
        {employee && (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src={employee.avatarUrl ?? undefined} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {employee.firstName} {employee.lastName}
              </p>
              <Badge variant={roleBadgeVariant[employee.role]} className="text-xs mt-0.5">
                {employee.role}
              </Badge>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-destructive hover:bg-muted rounded-md transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}