"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmployeeTable from "./employee-table";

import type { Employee } from "@/lib/api/employee/employee.type";
import type { Team } from "@/lib/api/admin/team.type";
import { Site } from "@/lib/api/site/site.type";
import EmployeeDrawer from "./employee-drawer";

type Props = {
  employees: Employee[];
  teams: Team[];
};

export default function EmployeeList({ employees, teams }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = employees.filter((emp) =>
    `${emp.firstName} ${emp.lastName}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const selectedEmployee = employees.find((e) => e.id === selectedId);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Employees</h1>
          <p className="text-white/50 text-sm">Manage your workforce</p>
        </div>

        <Button
          className="gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={() => router.push("/admin/employees/create")}
        >
          <Plus size={18} />
          Add Employee
        </Button>
      </div>

      {/* Table */}
      <EmployeeTable
        employees={filtered}
        teams={teams}
        search={search}
        setSearch={setSearch}
        onSelect={setSelectedId}
      />

      {/* Drawer */}
      <EmployeeDrawer
        employee={selectedEmployee ?? null}
        teams={teams}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
}
