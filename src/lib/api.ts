const API_URL = 'https://functions.poehali.dev/7bc69211-2291-426c-beb6-8b34cab75580';

export type Entity = 'competitions' | 'grants' | 'events';

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
  type?: string;
  url?: string;
  status: string;
  created_at: string;
}

export type AnyItem = Competition | Grant | Event;

async function request(method: string, path: string, body?: object, token?: string) {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers['X-Admin-Token'] = token;
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

export const api = {
  list: (entity: Entity, status = 'active') =>
    request('GET', `/?entity=${entity}&status=${status}`),

  create: (entity: Entity, data: object, token: string) =>
    request('POST', `/?entity=${entity}`, data, token),

  update: (entity: Entity, id: number, data: object, token: string) =>
    request('PUT', `/?entity=${entity}&id=${id}`, data, token),

  remove: (entity: Entity, id: number, token: string) =>
    request('DELETE', `/?entity=${entity}&id=${id}`, undefined, token),
};
