// AI-GENERATED
import type { Exam } from '../types/session';

const BASE_URL = 'http://localhost:3000/api';

export async function getExams(username: string, password: string): Promise<Exam[]> {
  const res = await fetch(`${BASE_URL}/exams`, {
    headers: { Authorization: `Basic ${btoa(`${username}:${password}`)}` },
  });
  if (!res.ok) throw { status: res.status, message: 'Failed to load exams' };
  return res.json();
}
