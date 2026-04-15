// lib/api/site/site.service.ts
import { api } from "@/lib/api/client";
import { Site } from "./site.type";

const getAll = () => api.get<Site[]>("/sites");

const getById = (id: string) => api.get<Site>(`/sites/${id}`);

export const siteService = {
  getAll,
  getById,
};
