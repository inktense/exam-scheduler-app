// AI-GENERATED
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exam } from './exam.entity';
import { ExamsRepository } from './exams.repository';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Exam]), AuthModule, UsersModule],
  providers: [ExamsRepository, ExamsService],
  controllers: [ExamsController],
  exports: [ExamsService],
})
export class ExamsModule {}
