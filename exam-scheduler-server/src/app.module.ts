// AI-GENERATED
import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { ExamsModule } from './exams/exams.module';
import { UsersService } from './users/users.service';
import { ExamsService } from './exams/exams.service';
import { seedDatabase } from './seed/seed';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, SessionsModule, ExamsModule],
})
export class AppModule implements OnModuleInit {
  constructor(
    private readonly usersService: UsersService,
    private readonly examsService: ExamsService,
  ) {}

  async onModuleInit(): Promise<void> {
    await seedDatabase(this.usersService, this.examsService);
  }
}
