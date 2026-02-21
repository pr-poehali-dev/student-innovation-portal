import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PUBLIC_URL = "https://functions.poehali.dev/9b3e0bbd-64be-451f-93da-c08e7583de2d";
const CONTENT_URL = "https://functions.poehali.dev/437ee371-fed9-4418-babb-bc63f505c1fe";
const AUTH_URL = "https://functions.poehali.dev/e6e40125-d1a6-4b0a-bd71-478f2f6e6384";

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

async function fetchPublic<T>(type: string): Promise<T[]> {
  const res = await fetch(`${PUBLIC_URL}/?type=${type}`);
  if (!res.ok) throw new Error("Fetch error");
  return res.json();
}

async function fetchAdmin(type: string, token: string) {
  const res = await fetch(`${CONTENT_URL}/?type=${type}`, {
    headers: { "X-Admin-Token": token },
  });
  if (!res.ok) throw new Error("Fetch error");
  const data = await res.json();
  return (data.items ?? data) as Record<string, string>[];
}

export function useCompetitions() {
  return useQuery<Competition[]>({
    queryKey: ["competitions"],
    queryFn: () => fetchPublic<Competition>("competitions"),
    staleTime: 60_000,
  });
}

export function useGrants() {
  return useQuery<Grant[]>({
    queryKey: ["grants"],
    queryFn: () => fetchPublic<Grant>("grants"),
    staleTime: 60_000,
  });
}

export function useEvents() {
  return useQuery<ContentEvent[]>({
    queryKey: ["events"],
    queryFn: () => fetchPublic<ContentEvent>("events"),
    staleTime: 60_000,
  });
}

export function useAdminData(type: string, token: string) {
  return useQuery({
    queryKey: ["admin", type],
    queryFn: () => fetchAdmin(type, token),
    enabled: !!token,
    staleTime: 30_000,
  });
}

export function useAdminLogin() {
  return useMutation({
    mutationFn: async (password: string) => {
      const res = await fetch(AUTH_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      return data.token as string;
    },
  });
}

export function useAdminMutations(type: string, token: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ["admin", type] });

  const create = useMutation({
    mutationFn: async (body: Record<string, string>) => {
      const res = await fetch(CONTENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ ...body, type }),
      });
      if (!res.ok) throw new Error("Ошибка создания");
    },
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: async (body: Record<string, string>) => {
      const res = await fetch(CONTENT_URL, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-Admin-Token": token },
        body: JSON.stringify({ ...body, type }),
      });
      if (!res.ok) throw new Error("Ошибка обновления");
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: number) => {
      const res = await fetch(`${CONTENT_URL}?type=${type}&id=${id}`, {
        method: "DELETE",
        headers: { "X-Admin-Token": token },
      });
      if (!res.ok) throw new Error("Ошибка удаления");
    },
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
