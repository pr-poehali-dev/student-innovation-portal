import func2url from "../../backend/func2url.json";

const BASE_URL = func2url.items;

export type ItemType = "competitions" | "grants" | "events";

export interface Competition {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  prize?: string;
  organizer?: string;
  url?: string;
  status: string;
  created_at: string;
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
  created_at: string;
}

export interface Event {
  id: number;
  title: string;
  description?: string;
  event_date?: string;
  event_time?: string;
  location?: string;
  type: string;
  url?: string;
  status: string;
  created_at: string;
}

export type AnyItem = Competition | Grant | Event;

function authHeaders(token?: string) {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Admin-Token"] = token;
  return headers;
}

export async function fetchItems(type: ItemType, token?: string): Promise<AnyItem[]> {
  const all = token ? "&all=1" : "";
  const res = await fetch(`${BASE_URL}?type=${type}${all}`, {
    headers: authHeaders(token),
  });
  return res.json();
}

export async function adminLogin(password: string): Promise<{ token: string; ok: boolean } | { error: string }> {
  const res = await fetch(`${BASE_URL}?action=auth`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  return res.json();
}

export async function createItem(type: ItemType, data: Partial<AnyItem>, token: string): Promise<AnyItem> {
  const res = await fetch(`${BASE_URL}?type=${type}`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateItem(type: ItemType, id: number, data: Partial<AnyItem>, token: string): Promise<AnyItem> {
  const res = await fetch(`${BASE_URL}?type=${type}&id=${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteItem(type: ItemType, id: number, token: string): Promise<void> {
  await fetch(`${BASE_URL}?type=${type}&id=${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}
