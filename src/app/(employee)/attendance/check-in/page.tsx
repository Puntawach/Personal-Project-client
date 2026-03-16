'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, MapPin, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import type { Site } from '@/lib/types'

// [API] fetch sites for dropdown: GET /sites
const mockSites: Site[] = [
  { id: 'site-1', name: 'โครงการ ANC Tower A', lat: 13.756, long: 100.502 },
  { id: 'site-2', name: 'โครงการ ANC Residence B', lat: 13.762, long: 100.512 },
  { id: 'site-3', name: 'โครงการ ANC Warehouse C', lat: 13.748, long: 100.495 },
]

// [API] fetch today attendance to check if already checked in: GET /attendance/me
// [STATE] isAlreadyCheckedIn: boolean
const isAlreadyCheckedIn = false

export default function CheckInPage() {
  // [STATE] selectedSite: string
  const [selectedSite, setSelectedSite] = useState<string>('')

  // [STATE] isLoading: boolean
  const [isLoading, setIsLoading] = useState(false)

  const today = new Date()
  const dateLabel = today.toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  // Live clock — in real impl use useEffect + setInterval
  const timeLabel = today.toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // [LOGIC] disable button if isAlreadyCheckedIn or !selectedSite
  const canSubmit = !isAlreadyCheckedIn && !!selectedSite && !isLoading

  function handleSubmit() {
    if (!canSubmit) return
    setIsLoading(true)
    // [API] POST /attendance/check-in { siteId: selectedSite, workDate: today, checkInTime: new Date() }
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
          <h1 className="text-lg font-bold">เข้างาน</h1>
          <p className="text-xs text-muted-foreground">Check-in</p>
        </div>
      </div>

      {/* Already checked-in warning */}
      {isAlreadyCheckedIn && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-700">
            คุณได้เข้างานแล้ววันนี้ ไม่สามารถเข้างานซ้ำได้
          </AlertDescription>
        </Alert>
      )}

      {/* Clock card */}
      <Card className="text-center">
        <CardContent className="pt-8 pb-8">
          <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
            <Clock size={16} />
            <span className="text-sm">{dateLabel}</span>
          </div>
          {/* [STATE] live clock — useEffect with setInterval updating every second */}
          <p className="text-5xl font-bold tracking-tight font-mono">{timeLabel}</p>
          <p className="text-xs text-muted-foreground mt-2">เวลาปัจจุบัน (WIB)</p>
        </CardContent>
      </Card>

      {/* Site selector */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <MapPin size={15} className="text-muted-foreground" />
            เลือกไซต์งาน
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* [STATE] sites: Site[] - list of available sites */}
          <Select
            value={selectedSite}
            onValueChange={setSelectedSite}
            disabled={isAlreadyCheckedIn}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="เลือกไซต์งาน..." />
            </SelectTrigger>
            <SelectContent>
              {mockSites.map((site) => (
                <SelectItem key={site.id} value={site.id}>
                  {site.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Work date (read-only, always today) */}
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">วันทำงาน</span>
            <span className="font-medium">
              {today.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Confirm button */}
      <Button
        size="lg"
        className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white text-base h-14"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {isLoading ? (
          <>
            <span className="animate-spin">⏳</span> กำลังบันทึก...
          </>
        ) : (
          <>
            <CheckCircle2 size={20} />
            ยืนยันเข้างาน
          </>
        )}
      </Button>

      {!selectedSite && !isAlreadyCheckedIn && (
        <p className="text-center text-xs text-muted-foreground">
          กรุณาเลือกไซต์งานก่อนกดยืนยัน
        </p>
      )}
    </div>
  )
}
