// AI-GENERATED
import type { Session, CreateSessionPayload } from '../types/session';

const BASE_URL = 'http://localhost:3000/api';

function authHeader(username: string, password: string): Record<string, string> {
  return { Authorization: `Basic ${btoa(`${username}:${password}`)}` };
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, message: body.message ?? 'Request failed' };
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export async function getSessions(username: string, password: string): Promise<Session[]> {
  const res = await fetch(`${BASE_URL}/sessions`, {
    headers: { ...authHeader(username, password) },
  });
  return handleResponse<Session[]>(res);
}

export async function createSession(
  username: string,
  password: string,
  data: CreateSessionPayload,
): Promise<Session> {
  const res = await fetch(`${BASE_URL}/sessions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader(username, password) },
    body: JSON.stringify(data),
  });
  return handleResponse<Session>(res);
}

export async function deleteSession(
  username: string,
  password: string,
  id: string,
): Promise<void> {
  const res = await fetch(`${BASE_URL}/sessions/${id}`, {
    method: 'DELETE',
    headers: { ...authHeader(username, password) },
  });
  return handleResponse<void>(res);
}
