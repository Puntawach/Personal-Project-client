"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/v0/ui/dialog";
import { MapPin, MinusCircle, Plus, Search } from "lucide-react";
import { useMemo, useState } from "react";

// ── Mock data ────────────────────────────────────────────────────────────────

const SITES = [
  { id: "s1", name: "Downtown HQ" },
  { id: "s2", name: "Westside Depot" },
  { id: "s3", name: "North Warehouse" },
];

const TEAMS = [
  { id: "t1", name: "Alpha Crew", siteId: "s1", leaderId: "e1" },
  { id: "t2", name: "Beta Squad", siteId: "s2", leaderId: "e4" },
  { id: "t3", name: "Gamma Unit", siteId: "s3", leaderId: "e7" },
];

const INITIAL_EMPLOYEES = [
  {
    id: "e1",
    name: "Marcus Reid",
    pos: "Senior Foreman",
    role: "leader",
    teamId: "t1",
  },
  {
    id: "e2",
    name: "Priya Nair",
    pos: "Field Technician",
    role: "member",
    teamId: "t1",
  },
  {
    id: "e3",
    name: "Jordan Blake",
    pos: "Site Inspector",
    role: "member",
    teamId: "t1",
  },
  {
    id: "e4",
    name: "Sara Okonkwo",
    pos: "Lead Engineer",
    role: "leader",
    teamId: "t2",
  },
  {
    id: "e5",
    name: "Luca Martini",
    pos: "Operator",
    role: "member",
    teamId: "t2",
  },
  {
    id: "e6",
    name: "Chen Wei",
    pos: "Safety Officer",
    role: "member",
    teamId: "t2",
  },
  {
    id: "e7",
    name: "Diana Cross",
    pos: "Project Manager",
    role: "leader",
    teamId: "t3",
  },
  {
    id: "e8",
    name: "Alex Torres",
    pos: "Crew Hand",
    role: "member",
    teamId: "t3",
  },
  {
    id: "e9",
    name: "Sam Yuen",
    pos: "Electrician",
    role: "member",
    teamId: null,
  },
  {
    id: "e10",
    name: "Fatima Hassan",
    pos: "Plumber",
    role: "member",
    teamId: null,
  },
  {
    id: "e11",
    name: "Riku Tanaka",
    pos: "Welder",
    role: "member",
    teamId: null,
  },
] as const;

type Employee = {
  id: string;
  name: string;
  pos: string;
  role: string;
  teamId: string | null;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({
  name,
  size = "md",
  variant = "gray",
}: {
  name: string;
  size?: "xs" | "sm" | "md";
  variant?: "blue" | "gray";
}) {
  const sizeClass = {
    xs: "w-6 h-6 text-[10px]",
    sm: "w-7 h-7 text-xs",
    md: "w-8 h-8 text-sm",
  }[size];
  const colorClass =
    variant === "blue"
      ? "bg-blue-100 text-blue-800"
      : "bg-muted text-muted-foreground";
  return (
    <div
      className={`${sizeClass} ${colorClass} rounded-full flex items-center justify-center font-medium shrink-0`}
    >
      {initials(name)}
    </div>
  );
}

// ── Page component ───────────────────────────────────────────────────────────

export default function TeamsPage() {
  const [employees, setEmployees] = useState<Employee[]>(
    INITIAL_EMPLOYEES.map((e) => ({ ...e })),
  );
  const [search, setSearch] = useState("");
  const [modalTeamId, setModalTeamId] = useState<string | null>(null);
  const [modalSearch, setModalSearch] = useState("");

  const filteredTeams = useMemo(
    () =>
      TEAMS.filter((t) => t.name.toLowerCase().includes(search.toLowerCase())),
    [search],
  );

  const unassigned = useMemo(
    () =>
      employees.filter(
        (e) =>
          e.role !== "admin" &&
          e.teamId === null &&
          e.name.toLowerCase().includes(modalSearch.toLowerCase()),
      ),
    [employees, modalSearch],
  );

  const activeTeam = TEAMS.find((t) => t.id === modalTeamId);

  const openModal = (teamId: string) => {
    setModalTeamId(teamId);
    setModalSearch("");
  };

  const closeModal = () => {
    setModalTeamId(null);
    setModalSearch("");
  };

  const addMember = (empId: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, teamId: modalTeamId } : e)),
    );
    closeModal();
  };

  const removeMember = (empId: string) => {
    setEmployees((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, teamId: null } : e)),
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Teams</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage crews and assignments.
          </p>
        </div>
        <Button className="gap-2 w-fit">
          <Plus size={15} />
          Create new team
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search teams..."
          className="pl-9"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTeams.map((team) => {
          const site = SITES.find((s) => s.id === team.siteId);
          const leader = employees.find((e) => e.id === team.leaderId);
          const members = employees.filter((e) => e.teamId === team.id);

          return (
            <Card
              key={team.id}
              className="flex flex-col hover:shadow-sm transition-shadow"
            >
              {/* Card header */}
              <CardHeader className="pb-3 bg-muted/40 rounded-t-lg border-b px-4 pt-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-base">{team.name}</p>
                    <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                      <MapPin size={11} />
                      <span className="text-xs">
                        {site?.name ?? "Unassigned"}
                      </span>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs shrink-0">
                    {members.length} member{members.length !== 1 ? "s" : ""}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col flex-1 p-0">
                {/* Leader */}
                <div className="px-4 py-3 border-b">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground mb-2">
                    Team leader
                  </p>
                  {leader ? (
                    <div className="flex items-center gap-2">
                      <Avatar name={leader.name} size="sm" variant="blue" />
                      <span className="text-sm font-medium">{leader.name}</span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      No leader assigned
                    </p>
                  )}
                </div>

                {/* Members */}
                <div className="px-4 py-3 flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                      Crew members
                    </p>
                    <button
                      onClick={() => openModal(team.id)}
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:opacity-75 transition-opacity"
                    >
                      <Plus size={11} />
                      Add
                    </button>
                  </div>

                  <div className="space-y-0.5">
                    {members.length > 0 ? (
                      members.map((m) => (
                        <div
                          key={m.id}
                          className="group flex items-center justify-between py-1.5 border-b border-border/40 last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar name={m.name} size="xs" />
                            <span className="text-sm">{m.name}</span>
                          </div>
                          <button
                            onClick={() => removeMember(m.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive p-0.5"
                            title="Remove from team"
                          >
                            <MinusCircle size={13} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground italic py-1">
                        No members assigned.
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {filteredTeams.length === 0 && (
          <p className="col-span-full text-center text-muted-foreground text-sm py-10">
            No teams match your search.
          </p>
        )}
      </div>

      {/* Add member dialog */}
      <Dialog
        open={!!modalTeamId}
        onOpenChange={(open) => !open && closeModal()}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Add to <span className="text-primary">{activeTeam?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Search unassigned employees..."
            value={modalSearch}
            onChange={(e) => setModalSearch(e.target.value)}
            autoFocus
            className="mt-1"
          />

          <div className="space-y-0.5 max-h-72 overflow-y-auto -mx-1 px-1 mt-1">
            {unassigned.length > 0 ? (
              unassigned.map((e) => (
                <button
                  key={e.id}
                  onClick={() => addMember(e.id)}
                  className="w-full flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <Avatar name={e.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{e.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {e.pos}
                    </p>
                  </div>
                  <Plus size={14} className="text-muted-foreground shrink-0" />
                </button>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-6">
                No unassigned employees found.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
