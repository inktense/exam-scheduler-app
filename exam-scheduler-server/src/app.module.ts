// AI-GENERATED
import { Module, OnModuleInit } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SessionsModule } from './sessions/sessions.module';
import { UsersService } from './users/users.service';
import { seedDatabase } from './seed/seed';

@Module({
  imports: [DatabaseModule, UsersModule, AuthModule, SessionsModule],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usersService: UsersService) {}

  async onModuleInit(): Promise<void> {
    // TODO: seedDatabase will be a no-op until UsersService is implemented
    await seedDatabase(this.usersService);
  }
}
