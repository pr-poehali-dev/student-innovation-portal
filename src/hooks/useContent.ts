import { useQuery } from "@tanstack/react-query";
import func2url from "../../backend/func2url.json";

const API_URL = func2url["innovations-api"];

export interface Competition {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  prize?: string;
  organizer?: string;
  url?: string;
  status: string;
}

export interface Grant {
  id: number;
  title: string;
  description?: string;
  amount?: string;
  deadline?: string;
  organizer?: string;
  url?: string;
  status: string;
}

export interface ContentEvent {
  id: number;
  title: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  type?: string;
  url?: string;
  status: string;
}

async function fetchEntity<T>(entity: string): Promise<T[]> {
  const res = await fetch(`${API_URL}/?entity=${entity}&status=active`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export function useCompetitions() {
  return useQuery<Competition[]>({
    queryKey: ["competitions"],
    queryFn: () => fetchEntity<Competition>("competitions"),
    staleTime: 60_000,
  });
}

export function useGrants() {
  return useQuery<Grant[]>({
    queryKey: ["grants"],
    queryFn: () => fetchEntity<Grant>("grants"),
    staleTime: 60_000,
  });
}

export function useEvents() {
  return useQuery<ContentEvent[]>({
    queryKey: ["events"],
    queryFn: () => fetchEntity<ContentEvent>("events"),
    staleTime: 60_000,
  });
}
