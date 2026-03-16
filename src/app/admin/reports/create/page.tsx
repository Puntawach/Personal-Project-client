'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ImagePlus, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Attendance } from '@/lib/types'

// [API] fetch recent attendances for selector: GET /attendance/me → filter SUBMITTED/WORKING
// [STATE] attendances: Attendance[]
const mockAttendances: Attendance[] = [
  { id: 'att-1', workDate: new Date().toISOString(), totalHours: 6.5, normalHours: 6.5, otHours: 0, workDescription: null, issues: null, status: 'WORKING', employeeId: '1', siteId: 'site-1', checkIns: [] },
  { id: 'att-2', workDate: new Date(Date.now() - 86400000).toISOString(), totalHours: 9, normalHours: 8, otHours: 1, workDescription: null, issues: null, status: 'SUBMITTED', employeeId: '1', siteId: 'site-1', checkIns: [] },
  { id: 'att-4', workDate: new Date(Date.now() - 86400000 * 3).toISOString(), totalHours: 7.5, normalHours: 7.5, otHours: 0, workDescription: null, issues: null, status: 'SUBMITTED', employeeId: '1', siteId: 'site-2', checkIns: [] },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('th-TH', { weekday: 'short', day: 'numeric', month: 'short' })
}

export default function CreateReportPage() {
  // [STATE] selectedAttendanceId: string
  const [selectedAttendanceId, setSelectedAttendanceId] = useState('')
  // [STATE] imageFile: File | null
  const [imageFile, setImageFile] = useState<File | null>(null)
  // [STATE] imagePreview: string | null
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  // [STATE] detail: string
  const [detail, setDetail] = useState('')
  // [STATE] isSubmitting: boolean
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    // [STATE] imagePreview: URL.createObjectURL(imageFile)
    setImagePreview(URL.createObjectURL(file))
  }

  function handleRemoveImage() {
    setImageFile(null)
    setImagePreview(null)
  }

  // [LOGIC] validate: must have image + attendanceId + detail before submit
  const canSubmit = !!imageFile && !!selectedAttendanceId && !!detail.trim() && !isSubmitting

  function handleSubmit() {
    if (!canSubmit) return
    setIsSubmitting(true)
    // [API] POST /reports (multipart/form-data) { image: imageFile, attendanceId, detail }
    // [NAVIGATE] on success → /reports
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)
    }, 1500)
  }

  if (isSuccess) {
    return (
      <div className="max-w-lg mx-auto pt-20 flex flex-col items-center gap-4 text-center">
        <div className="bg-green-100 rounded-full p-5">
          <CheckCircle2 size={48} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold">ส่งรายงานสำเร็จ</h2>
        <p className="text-sm text-muted-foreground">รายงานของคุณถูกส่งแล้ว รอการอนุมัติจาก Admin</p>
        <Link href="/reports">
          <Button className="mt-2">ดูรายงานทั้งหมด</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/reports">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <ArrowLeft size={18} />
          </Button>
        </Link>
        <div>
          <h1 className="text-lg font-bold">ส่งรายงานงาน</h1>
          <p className="text-xs text-muted-foreground">Submit Work Report</p>
        </div>
      </div>

      {/* Attendance selector */}
      <div className="space-y-2">
        <Label>เลือกวันทำงาน</Label>
        <Select value={selectedAttendanceId} onValueChange={setSelectedAttendanceId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="เลือกวันที่ต้องการส่งรายงาน..." />
          </SelectTrigger>
          <SelectContent>
            {mockAttendances.map((att) => (
              <SelectItem key={att.id} value={att.id}>
                {formatDate(att.workDate)} — {att.totalHours.toFixed(1)} ชม.
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Image upload */}
      <div className="space-y-2">
        <Label>รูปภาพงาน <span className="text-red-500">*</span></Label>
        {imagePreview ? (
          <div className="relative rounded-xl overflow-hidden border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="preview" className="w-full h-56 object-cover" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label htmlFor="image-upload" className="cursor-pointer">
            <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
              <CardContent className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
                <div className="bg-muted rounded-full p-4">
                  <ImagePlus size={28} />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-foreground">คลิกเพื่อเลือกรูปภาพ</p>
                  <p className="text-xs">หรือลากไฟล์มาวางที่นี่</p>
                  <p className="text-xs mt-1 text-muted-foreground/70">JPG, PNG เท่านั้น</p>
                </div>
                <Upload size={16} />
              </CardContent>
            </Card>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        )}
      </div>

      {/* Detail textarea */}
      <div className="space-y-2">
        <Label htmlFor="detail">
          รายละเอียดงาน <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="detail"
          placeholder="อธิบายงานที่ทำ เช่น เทพื้นคอนกรีตชั้น 3 Zone A เสร็จแล้ว 80%..."
          rows={5}
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
        />
        <p className="text-xs text-muted-foreground text-right">{detail.length} ตัวอักษร</p>
      </div>

      {/* Submit */}
      <Button
        size="lg"
        className="w-full h-12 gap-2"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {isSubmitting ? (
          <><span className="animate-spin">⏳</span> กำลังส่ง...</>
        ) : (
          <>ส่งรายงาน</>
        )}
      </Button>

      {!canSubmit && !isSubmitting && (
        <p className="text-center text-xs text-muted-foreground">
          กรุณาเลือกวันทำงาน เพิ่มรูปภาพ และกรอกรายละเอียด
        </p>
      )}
    </div>
  )
}
