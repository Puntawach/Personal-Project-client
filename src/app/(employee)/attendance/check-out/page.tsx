'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, Info, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import type { Attendance, CheckIn } from '@/lib/types'

// [API] fetch today's attendance: GET /attendance/me → find where status is WORKING
// [STATE] todayAttendance: Attendance | null
const mockTodayAttendance: Attendance = {
  id: 'att-1',
  workDate: new Date().toISOString(),
  totalHours: 0,
  normalHours: 0,
  otHours: 0,
  workDescription: null,
  issues: null,
  status: 'WORKING',
  employeeId: '1',
  siteId: 'site-1',
  checkIns: [
    {
      id: 'ci-1',
      checkInTime: new Date(new Date().setHours(7, 30, 0)).toISOString(),
      checkOutTime: null,
      attendanceId: 'att-1',
    },
  ],
}

const mockSiteName = 'โครงการ ANC Tower A'

// [LOGIC] calculate hours worked
function calcHours(checkInTime: string) {
  const diffMs = Date.now() - new Date(checkInTime).getTime()
  const rawHours = diffMs / (1000 * 60 * 60)
  // [LOGIC] totalHours: rawHours > 5 ? rawHours - 1 : rawHours (lunch deduction)
  const totalHours = rawHours > 5 ? rawHours - 1 : rawHours
  // [LOGIC] normalHours: Math.min(totalHours, 8)
  const normalHours = Math.min(totalHours, 8)
  // [LOGIC] otHours: Math.max(totalHours - 8, 0)
  const otHours = Math.max(totalHours - 8, 0)
  return { rawHours, totalHours, normalHours, otHours }
}

export default function CheckOutPage() {
  // [STATE] workDescription: string
  const [workDescription, setWorkDescription] = useState('')
  // [STATE] issues: string
  const [issues, setIssues] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // [STATE] activeCheckIn: CheckIn | null - find checkIn without checkOutTime
  const activeCheckIn: CheckIn | null =
    mockTodayAttendance.checkIns.find((ci) => !ci.checkOutTime) ?? null

  const hours = activeCheckIn ? calcHours(activeCheckIn.checkInTime) : null

  const checkInTimeLabel = activeCheckIn
    ? new Date(activeCheckIn.checkInTime).toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

  const nowLabel = new Date().toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // [LOGIC] disable button if !todayAttendance or !workDescription
  const canSubmit = !!mockTodayAttendance && !!workDescription.trim() && !isLoading

  function handleSubmit() {
    if (!canSubmit) return
    setIsLoading(true)
    // [API] PATCH /attendance/:attendanceId/check-out { checkOutTime: new Date(), workDescription, issues }
    // [NAVIGATE] on success → redirect to dashboard
    setTimeout(() => setIsLoading(false), 1500) // placeholder
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">เลิกงาน</h1>
          <p className="text-xs text-muted-foreground">Check-out</p>
        </div>
      </div>

      {/* Live clock */}
      <Card className="text-center">
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-1">
            <Clock size={15} />
            <span className="text-sm">เวลาปัจจุบัน</span>
          </div>
          {/* [STATE] live clock via useEffect + setInterval */}
          <p className="text-4xl font-bold font-mono tracking-tight">{nowLabel}</p>
        </CardContent>
      </Card>

      {/* Today attendance info */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">ข้อมูลการทำงานวันนี้</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">ไซต์งาน</span>
            <span className="font-medium">{mockSiteName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">เวลาเข้างาน</span>
            <span className="font-medium text-blue-600">{checkInTimeLabel}</span>
          </div>
          {hours && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">ชั่วโมงที่ทำมา</span>
              {/* [LOGIC] (now - checkInTime) / 3600000 */}
              <span className="font-medium">{hours.rawHours.toFixed(1)} ชม.</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hours preview */}
      {hours && (
        <Card className="border-orange-100 bg-orange-50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-orange-800">สรุปชั่วโมงทำงาน</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-orange-700">ชั่วโมงรวม</span>
              <span className="font-semibold text-orange-900">{hours.totalHours.toFixed(1)} ชม.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-700">ชั่วโมงปกติ</span>
              <span className="font-medium">{hours.normalHours.toFixed(1)} ชม.</span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-700">OT</span>
              <span className={`font-medium ${hours.otHours > 0 ? 'text-green-700' : 'text-muted-foreground'}`}>
                {hours.otHours > 0 ? `+${hours.otHours.toFixed(1)} ชม.` : '-'}
              </span>
            </div>
            <Separator className="bg-orange-200" />
            {/* [LOGIC] lunch deduction note */}
            <div className="flex items-start gap-1.5 text-xs text-orange-600">
              <Info size={12} className="mt-0.5 shrink-0" />
              <span>หักพักกลางวัน 1 ชั่วโมง อัตโนมัติ หากทำงานเกิน 5 ชั่วโมง</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Work description */}
      <div className="space-y-2">
        <Label htmlFor="workDescription">
          รายละเอียดงานวันนี้ <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="workDescription"
          placeholder="อธิบายงานที่ทำวันนี้... เช่น เทพื้นคอนกรีตชั้น 3 บริเวณ Zone A"
          rows={4}
          value={workDescription}
          onChange={(e) => setWorkDescription(e.target.value)}
          // [STATE] workDescription
        />
      </div>

      {/* Issues */}
      <div className="space-y-2">
        <Label htmlFor="issues">ปัญหาที่พบ (ถ้ามี)</Label>
        <Textarea
          id="issues"
          placeholder="ปัญหาที่พบระหว่างทำงาน เช่น วัสดุไม่เพียงพอ, เครื่องมือชำรุด..."
          rows={3}
          value={issues}
          onChange={(e) => setIssues(e.target.value)}
          // [STATE] issues
        />
      </div>

      {/* Submit button */}
      <Button
        size="lg"
        variant="destructive"
        className="w-full gap-2 h-14 text-base"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <><span className="animate-spin">⏳</span> กำลังบันทึก...</>
        ) : (
          <><LogOut size={20} />ยืนยันเลิกงาน</>
        )}
      </Button>

      {!workDescription.trim() && (
        <p className="text-center text-xs text-muted-foreground">
          กรุณากรอกรายละเอียดงานก่อนกดยืนยัน
        </p>
      )}
    </div>
  )
}
