// AI-GENERATED
import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { CreateSessionDto } from './dto/create-session.dto';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepository: SessionsRepository) {}

  // TODO: implement findAllByUser(userId: string): Promise<Session[]>
  //   — delegates to sessionsRepository.findAllByUserId

  // TODO: implement create(userId: string, dto: CreateSessionDto): Promise<Session>
  //   — validate scheduledAt is in the future (throw BadRequestException if not)
  //   — delegates to sessionsRepository.create

  // TODO: implement remove(id: string, userId: string): Promise<void>
  //   — find session by id (throw NotFoundException if not found)
  //   — verify session.userId === userId (throw ForbiddenException if not)
  //   — delegates to sessionsRepository.remove
}
