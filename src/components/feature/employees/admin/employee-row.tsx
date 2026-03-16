import { Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Employee } from "@/lib/api/employee/employee.type";
import type { Team } from "@/lib/api/admin/team.type";

type Props = {
  employee: Employee;
  team: Team | null;
  onSelect: (id: string) => void;
};

export default function EmployeeRow({ employee, team, onSelect }: Props) {
  const initials = `${employee.firstName[0]}${employee.lastName[0]}`;

  return (
    <tr
      className="hover:bg-white/5 cursor-pointer"
      onClick={() => onSelect(employee.id)}
    >
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={employee.avatarUrl ?? undefined} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>

          <div>
            <p className="text-white font-medium">
              {employee.firstName} {employee.lastName}
            </p>
            <p className="text-xs text-white/40">{employee.email}</p>
          </div>
        </div>
      </td>

      <td className="px-6 py-4 text-white/70">{employee.role}</td>

      <td className="px-6 py-4 text-white/70">
        {team?.name ?? (
          <span className="text-white/30 text-xs italic">Unassigned</span>
        )}
      </td>

      <td className="px-6 py-4">
        <span className="text-green-400 font-medium">{employee.status}</span>
      </td>

      <td className="px-6 py-4 text-right">
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onSelect(employee.id);
          }}
        >
          <Edit2 size={16} />
        </Button>
      </td>
    </tr>
  );
}
