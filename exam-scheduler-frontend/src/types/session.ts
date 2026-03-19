// AI-GENERATED
export interface Exam {
  id: string;
  name: string;
  durationMinutes: number;
  numberOfQuestions: number;
  createdAt: string;
}

export interface Session {
  id: string;
  examId: string;
  examName: string;
  scheduledAt: string;
  durationMinutes: number;
  status: 'SCHEDULED' | 'CANCELED';
  createdAt: string;
}

export interface CreateSessionPayload {
  examId: string;
  scheduledAt: string;
}
