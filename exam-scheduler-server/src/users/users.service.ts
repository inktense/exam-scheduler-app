// AI-GENERATED
import { ConflictException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findByUsername(username);
  }

  async register(username: string, password: string): Promise<User> {
    const existing = await this.usersRepository.findByUsername(username);
    if (existing) {
      throw new ConflictException('Username already taken');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    return this.usersRepository.create(username, passwordHash);
  }
}
