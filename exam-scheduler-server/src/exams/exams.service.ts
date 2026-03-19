// AI-GENERATED
import { Injectable } from '@nestjs/common';
import { ExamsRepository } from './exams.repository';
import { Exam } from './exam.entity';

@Injectable()
export class ExamsService {
  constructor(private readonly examsRepository: ExamsRepository) {}

  findAll(): Promise<Exam[]> {
    return this.examsRepository.findAll();
  }

  findOneById(id: string): Promise<Exam | null> {
    return this.examsRepository.findOneById(id);
  }

  findOneByName(name: string): Promise<Exam | null> {
    return this.examsRepository.findOneByName(name);
  }

  create(data: Partial<Exam>): Promise<Exam> {
    return this.examsRepository.create(data);
  }
}
