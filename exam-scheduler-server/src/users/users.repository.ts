// AI-GENERATED
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findByUsername(username: string): Promise<User | null> {
    return this.repo.findOneBy({ username });
  }

  async create(username: string, passwordHash: string): Promise<User> {
    const user = this.repo.create({ username, passwordHash });
    return this.repo.save(user);
  }
}
