import { payrollService } from "@/lib/api/payroll/payroll-service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const month = Number(req.nextUrl.searchParams.get("month"));
  const year = Number(req.nextUrl.searchParams.get("year"));

  try {
    const data = await payrollService.getSummary(month, year);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(null, { status: 404 });
  }
}
