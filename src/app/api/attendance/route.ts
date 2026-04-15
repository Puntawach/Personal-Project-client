// app/api/attendance/route.ts
import { attendanceService } from "@/lib/api/attendance/attendance.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const month = Number(req.nextUrl.searchParams.get("month"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  const data = await attendanceService.getAllByMonth(month, year);
  return NextResponse.json(data);
}
