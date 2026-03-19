// AI-GENERATED
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { ExamsService } from '../exams/exams.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';
import { Session } from './session.entity';

@Injectable()
export class SessionsService {
  constructor(
    private readonly sessionsRepository: SessionsRepository,
    private readonly examsService: ExamsService,
  ) {}

  async findAllByUser(userId: string): Promise<SessionResponseDto[]> {
    const sessions = await this.sessionsRepository.findAllByUserId(userId);
    return sessions.map(this.toDto);
  }

  async create(userId: string, dto: CreateSessionDto): Promise<SessionResponseDto> {
    if (new Date(dto.scheduledAt) <= new Date()) {
      throw new BadRequestException('scheduledAt must be in the future');
    }

    const exam = await this.examsService.findOneById(dto.examId);
    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    const session = await this.sessionsRepository.create({
      userId,
      examId: dto.examId,
      scheduledAt: new Date(dto.scheduledAt),
    });

    return this.toDto({ ...session, exam });
  }

  async remove(id: string, userId: string): Promise<void> {
    const session = await this.sessionsRepository.findOneById(id);

    if (!session) {
      throw new NotFoundException('Session not found');
    }

    if (session.userId !== userId) {
      throw new ForbiddenException('Session belongs to another user');
    }

    await this.sessionsRepository.remove(session);
  }

  private toDto(session: Session): SessionResponseDto {
    return {
      id: session.id,
      examId: session.examId,
      examName: session.exam.name,
      durationMinutes: session.exam.durationMinutes,
      scheduledAt: session.scheduledAt,
      status: session.status,
      createdAt: session.createdAt,
    };
  }
}
