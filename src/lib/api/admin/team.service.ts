// lib/api/admin/team.service.ts
import { api } from "@/lib/api/client";
import { Team } from "@/lib/api/admin/team.type";

const getAll = () => api.get<Team[]>("/teams");
const getById = (id: string) => api.get<Team>(`/teams/${id}`);

export const teamService = {
  getAll,
  getById,
};
