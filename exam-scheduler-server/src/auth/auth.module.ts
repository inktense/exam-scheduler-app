// AI-GENERATED
import { Module } from '@nestjs/common';
import { BasicAuthGuard } from './basic-auth.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [BasicAuthGuard],
  exports: [BasicAuthGuard],
})
export class AuthModule {}
