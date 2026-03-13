export type Role = 'WORKER' | 'LEADER' | 'ADMIN' | 'SUPER_ADMIN'
export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'DELETED'
export type AttendanceStatus = 'WORKING' | 'SUBMITTED' | 'APPROVED' | 'REJECTED'
export type ReportStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

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
  role: Role
  status: EmployeeStatus
  avatarUrl: string | null
  teamId: string | null
  createdAt: string
  updatedAt: string
}

export type CheckIn = {
  id: string
  checkInTime: string
  checkOutTime: string | null
  attendanceId: string
}

export type Attendance = {
  id: string
  workDate: string
  totalHours: number
  normalHours: number
  otHours: number
  workDescription: string | null
  issues: string | null
  status: AttendanceStatus
  employeeId: string
  siteId: string
  checkIns: CheckIn[]
}

export type ReportImage = {
  id: string
  imageUrl: string
  detail: string
  status: ReportStatus
  attendanceId: string
  createdAt: string
}

export type PayrollPeriod = {
  id: string
  month: number
  year: number
  isLocked: boolean
}

export type PayrollItem = {
  id: string
  normalHours: number
  otHours: number
  workDays: number
  normalPay: string
  otPay: string
  allowance: string
  totalPay: string
  employeeId: string
  payrollPeriodId: string
  payrollPeriod: PayrollPeriod
}

export type Team = {
  id: string
  name: string
  leaderId: string | null
  leader: Employee | null
  employees: Employee[]
}

export type Site = {
  id: string
  name: string
  lat: number
  long: number
}

export type ApiResponse<T> = {
  success: boolean
  data: T
  path: string
  timestamp: string
}

export type ApiError = {
  message: string
  error: string
  statusCode: number
}