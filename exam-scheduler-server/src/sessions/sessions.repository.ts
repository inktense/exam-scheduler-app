// AI-GENERATED
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Session } from './session.entity';

@Injectable()
export class SessionsRepository {
  constructor(
    @InjectRepository(Session)
    private readonly repo: Repository<Session>,
  ) {}

  // TODO: implement findAllByUserId(userId: string): Promise<Session[]>
  //   — order by scheduledAt ASC

  // TODO: implement findOneById(id: string): Promise<Session | null>

  // TODO: implement create(data: Partial<Session>): Promise<Session>

  // TODO: implement remove(session: Session): Promise<void>
}
