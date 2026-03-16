"use client";

import { useState } from "react";
import Link from "next/link";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportStatusBadge } from "@/components/shared/status-badge";
import { ReportCardSkeleton } from "@/components/shared/skeletons";
import { EmptyState } from "@/components/shared/empty-state";
import type { ReportImage, ReportStatus } from "@/lib/types";

// [API] fetch my reports: GET /reports/me
// [STATE] reports: ReportImage[]
const mockReports: ReportImage[] = [
  {
    id: "r-1",
    imageUrl: "https://placehold.co/400x300/e2e8f0/94a3b8?text=งาน+1",
    detail: "เทพื้นคอนกรีตชั้น 3 Zone A เสร็จแล้ว ผิวหน้าเรียบ",
    status: "APPROVED",
    attendanceId: "att-2",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "r-2",
    imageUrl: "https://placehold.co/400x300/e2e8f0/94a3b8?text=งาน+2",
    detail: "งานเหล็กชั้น 2 บริเวณ Zone B ติดตั้งครบตามแบบ",
    status: "PENDING",
    attendanceId: "att-3",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: "r-3",
    imageUrl: "https://placehold.co/400x300/e2e8f0/94a3b8?text=งาน+3",
    detail: "ก่ออิฐผนังชั้น 1 ฝั่งตะวันออกเสร็จ 60% ยังขาดวัสดุ",
    status: "REJECTED",
    attendanceId: "att-4",
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
  {
    id: "r-4",
    imageUrl: "https://placehold.co/400x300/e2e8f0/94a3b8?text=งาน+4",
    detail: "ติดตั้งระบบน้ำชั้น 1 เสร็จสมบูรณ์ ทดสอบแล้วไม่มีรอยรั่ว",
    status: "APPROVED",
    attendanceId: "att-6",
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: "r-5",
    imageUrl: "https://placehold.co/400x300/e2e8f0/94a3b8?text=งาน+5",
    detail: "ฉาบปูนผนังชั้น 2 ฝั่งเหนือ รอให้แห้ง 24 ชั่วโมงก่อนทาสี",
    status: "PENDING",
    attendanceId: "att-1",
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

type FilterType = "ALL" | ReportStatus;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("th-TH", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
}

export default function ReportsPage() {
  // [STATE] activeFilter: 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'
  const [activeFilter, setActiveFilter] = useState<FilterType>("ALL");
  const isLoading = false; // [STATE] isLoading

  // [LOGIC] filter reports by activeFilter
  const filtered =
    activeFilter === "ALL"
      ? mockReports
      : mockReports.filter((r) => r.status === activeFilter);

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">รายงานงาน</h1>
          <p className="text-sm text-muted-foreground">My Reports</p>
        </div>
        <Link href="/reports/create">
          <Button size="sm" className="gap-1.5">
            <Plus size={15} />
            ส่งรายงาน
          </Button>
        </Link>
      </div>

      {/* Filter tabs */}
      <Tabs
        value={activeFilter}
        onValueChange={(v) => setActiveFilter(v as FilterType)}
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="ALL" className="flex-1 sm:flex-none">
            ทั้งหมด ({mockReports.length})
          </TabsTrigger>
          <TabsTrigger value="PENDING" className="flex-1 sm:flex-none">
            รอ ({mockReports.filter((r) => r.status === "PENDING").length})
          </TabsTrigger>
          <TabsTrigger value="APPROVED" className="flex-1 sm:flex-none">
            อนุมัติ
          </TabsTrigger>
          <TabsTrigger value="REJECTED" className="flex-1 sm:flex-none">
            ไม่อนุมัติ
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Reports grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <ReportCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<FileText size={48} />}
          title="ไม่มีรายงาน"
          description="ยังไม่มีรายงานในหมวดนี้"
          action={{ label: "ส่งรายงาน", onClick: () => {} }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((report) => (
            <Card
              key={report.id}
              className="overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Image thumbnail */}
              <div className="relative h-44 bg-muted">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={report.imageUrl}
                  alt="report"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <ReportStatusBadge status={report.status} />
                </div>
              </div>
              <CardContent className="pt-3 pb-4 space-y-2">
                <p className="text-xs text-muted-foreground">
                  {formatDate(report.createdAt)}
                </p>
                <p className="text-sm line-clamp-2 text-foreground">
                  {report.detail}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
