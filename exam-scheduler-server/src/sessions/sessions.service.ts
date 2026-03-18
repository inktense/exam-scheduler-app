// AI-GENERATED
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { CreateSessionDto } from './dto/create-session.dto';
import { Session } from './session.entity';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  findAllByUser(userId: string): Promise<Session[]> {
    return this.sessionsRepository.findAllByUserId(userId);
  }

  create(userId: string, dto: CreateSessionDto): Promise<Session> {
    if (new Date(dto.scheduledAt) <= new Date()) {
      throw new BadRequestException('scheduledAt must be in the future');
    }

    return this.sessionsRepository.create({
      userId,
      examName: dto.examName,
      scheduledAt: new Date(dto.scheduledAt),
      durationMinutes: dto.durationMinutes,
    });
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
}
