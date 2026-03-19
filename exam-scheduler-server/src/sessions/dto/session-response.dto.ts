// AI-GENERATED
import { SessionStatus } from '../session.entity';

export class SessionResponseDto {
  id: string;
  examId: string;
  examName: string;
  durationMinutes: number;
  scheduledAt: Date;
  status: SessionStatus;
  createdAt: Date;
}
