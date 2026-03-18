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

  // TODO: implement findByUsername(username: string): Promise<User | null>
  // TODO: implement create(username: string, passwordHash: string): Promise<User>
}
