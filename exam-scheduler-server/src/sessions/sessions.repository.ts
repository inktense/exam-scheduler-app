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

  findAllByUserId(userId: string): Promise<Session[]> {
    return this.repo.find({
      where: { userId },
      order: { scheduledAt: 'ASC' },
    });
  }

  findOneById(id: string): Promise<Session | null> {
    return this.repo.findOneBy({ id });
  }

  async create(data: Partial<Session>): Promise<Session> {
    const session = this.repo.create(data);
    return this.repo.save(session);
  }

  async remove(session: Session): Promise<void> {
    await this.repo.remove(session);
  }
}
