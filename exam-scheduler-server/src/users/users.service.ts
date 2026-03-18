// AI-GENERATED
import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // TODO: implement findByUsername(username: string): Promise<User | null>
  //   — delegates to usersRepository.findByUsername

  // TODO: implement register(username: string, password: string): Promise<User>
  //   — check for duplicate username (throw 409 ConflictException if taken)
  //   — hash password with bcrypt (rounds: 10)
  //   — delegates to usersRepository.create
}
