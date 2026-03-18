import { Employee } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Briefcase, MapPin } from "lucide-react";

const mockToday = {
  isCheckedIn: false,
  checkInTime: null,
  site: "AAAA",
  team: "AAA",
  workedHours: 0,
};

type Props = {
  employee: Employee;
};

export default function DashboardCardStatus({ employee }: Props) {
  // [API] GET /attendance/me
  const today = mockToday;
  return (
    <div className="bg-slate-900 rounded-2xl p-5 text-white space-y-4">
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "text-xs font-semibold px-2.5 py-1 rounded-full",
            today.isCheckedIn
              ? "bg-green-500/20 text-green-400"
              : "bg-white/10 text-white/60",
          )}
        >
          {today.isCheckedIn ? "● On Duty" : "● Off Duty"}
        </span>
        <div className="text-right">
          <p className="text-[10px] text-white/50 uppercase tracking-wide">
            Worked Today
          </p>
          <p className="text-2xl font-bold">{today.workedHours}h</p>
        </div>
      </div>

      <div className="space-y-2">
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Current Assignment
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <MapPin size={14} className="text-blue-400" />
            <p className="font-semibold">{today.site}</p>
          </div>
        </div>
        <div>
          <p className="text-[10px] text-white/40 uppercase tracking-widest">
            Team
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <Briefcase size={14} className="text-blue-400" />
            <p className="font-semibold">{today.team}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
