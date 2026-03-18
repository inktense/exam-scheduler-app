// AI-GENERATED
const BASE_URL = 'http://localhost:3000/api';

export async function registerUser(username: string, password: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw { status: res.status, message: body.message ?? 'Registration failed' };
  }
}
