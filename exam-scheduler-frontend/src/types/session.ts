// AI-GENERATED
export interface Session {
  id: string;
  examName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'CANCELED';
  createdAt: string;
}

export interface CreateSessionPayload {
  examName: string;
  scheduledAt: string;
  durationMinutes: number;
}
