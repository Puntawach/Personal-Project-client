// components/features/payroll/payroll-row.tsx
import { ChevronDown, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { PayrollItem } from "@/lib/api/payroll/payroll-type";

type Props = {
  item: PayrollItem;
  isExpanded: boolean;
  teamName: string;
  onToggle: () => void;
};

// [UTILS] format currency
const thb = (value: string | number) =>
  `฿${Number(value).toLocaleString("th-TH", { minimumFractionDigits: 2 })}`;

export default function PayrollRow({
  item,
  isExpanded,
  teamName,
  onToggle,
}: Props) {
  const initials =
    `${item.employee.firstName[0]}${item.employee.lastName[0]}`.toUpperCase();

  return (
    <>
      {/* ── Main Row ─────────────────────────────────────────────────────── */}
      <tr
        className={cn(
          "hover:bg-white/5 transition-colors cursor-pointer",
          isExpanded && "bg-white/5",
        )}
        onClick={onToggle}
      >
        <td className="px-4 py-3 text-white/30">
          {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-blue-600 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-white">
                {item.employee.firstName} {item.employee.lastName}
              </p>
              <p className="text-xs text-white/40">{teamName}</p>
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-right text-white/70">{item.workDays}</td>
        <td className="px-4 py-3 text-right text-white/70">
          {thb(item.normalPay)}
        </td>
        <td className="px-4 py-3 text-right text-amber-400">
          {thb(item.otPay)}
        </td>
        <td className="px-4 py-3 text-right text-white/70">
          {thb(item.allowance)}
        </td>
        <td className="px-4 py-3 text-right font-bold text-blue-400">
          {thb(item.totalPay)}
        </td>
      </tr>

      {/* ── Expanded Detail ───────────────────────────────────────────────── */}
      {isExpanded && (
        <tr key={`${item.id}-detail`} className="bg-white/[0.02]">
          <td colSpan={7} className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
              {/* Breakdown */}
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase text-white/30 mb-3">
                  Breakdown
                </p>
                {[
                  {
                    label: "Normal Hours",
                    value: `${item.normalHours.toFixed(1)}h`,
                    sub: `× (฿${Number(item.employee.dailyRate ?? 0).toLocaleString()} / 8)`,
                    amount: thb(item.normalPay),
                    color: "text-white",
                  },
                  {
                    label: "OT Hours",
                    value: `${item.otHours.toFixed(1)}h`,
                    sub: "× 1.5x rate",
                    amount: thb(item.otPay),
                    color: "text-amber-400",
                  },
                  {
                    label: "Allowance",
                    value: `${item.workDays} days`,
                    sub: `× ฿${Number(item.employee.allowancePerDay ?? 0).toLocaleString()}/day`,
                    amount: thb(item.allowance),
                    color: "text-white",
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between items-start text-sm"
                  >
                    <div>
                      <span className="text-white/70">{row.label}: </span>
                      <span className="text-white font-medium">
                        {row.value}
                      </span>
                      <span className="text-white/30 text-xs ml-1">
                        {row.sub}
                      </span>
                    </div>
                    <span className={cn("font-bold", row.color)}>
                      {row.amount}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                <p className="text-xs font-bold uppercase text-white/30 mb-3">
                  Summary
                </p>
                {[
                  {
                    label: "Normal Pay",
                    value: thb(item.normalPay),
                    color: "text-white",
                  },
                  {
                    label: "OT Pay",
                    value: thb(item.otPay),
                    color: "text-amber-400",
                  },
                  {
                    label: "Allowance",
                    value: thb(item.allowance),
                    color: "text-white",
                  },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between text-sm">
                    <span className="text-white/60">{row.label}</span>
                    <span className={row.color}>{row.value}</span>
                  </div>
                ))}
                <div className="border-t border-white/10 pt-2 flex justify-between font-bold text-base">
                  <span className="text-white">Total Pay</span>
                  <span className="text-blue-400">{thb(item.totalPay)}</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
