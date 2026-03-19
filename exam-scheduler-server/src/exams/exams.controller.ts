// AI-GENERATED
import { Controller, Get, UseGuards } from '@nestjs/common';
import { ExamsService } from './exams.service';
import { BasicAuthGuard } from '../auth/basic-auth.guard';
import { ExamResponseDto } from './dto/exam-response.dto';

@Controller('exams')
@UseGuards(BasicAuthGuard)
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Get()
  findAll(): Promise<ExamResponseDto[]> {
    return this.examsService.findAll();
  }
}
