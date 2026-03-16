import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import EmployeeRow from "./employee-row";
import type { Employee } from "@/lib/api/employee/employee.type";
import type { Team } from "@/lib/api/admin/team.type";

type Props = {
  employees: Employee[];
  teams: Team[];
  search: string;
  setSearch: (v: string) => void;
  onSelect: (id: string) => void;
};

export default function EmployeeTable({
  employees,
  teams,
  search,
  setSearch,
  onSelect,
}: Props) {
  const getTeam = (teamId: string | null) =>
    teams.find((t) => t.id === teamId) ?? null;

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/5">
      {/* Search */}
      <div className="p-4 border-b border-white/10">
        <div className="relative max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            size={16}
          />
          <Input
            placeholder="Search employee..."
            className="pl-9 bg-white/5 border-white/10 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full text-sm text-left">
        <thead className="border-b border-white/10 text-white/40 text-xs uppercase">
          <tr>
            <th className="px-6 py-4">Employee</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Team</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <EmployeeRow
              key={emp.id}
              employee={emp}
              team={getTeam(emp.teamId)}
              onSelect={onSelect}
            />
          ))}

          {employees.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center py-10 text-white/30">
                No employees found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
