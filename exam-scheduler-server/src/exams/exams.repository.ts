// AI-GENERATED
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from './exam.entity';

@Injectable()
export class ExamsRepository {
  constructor(
    @InjectRepository(Exam)
    private readonly repo: Repository<Exam>,
  ) {}

  findAll(): Promise<Exam[]> {
    return this.repo.find({ order: { name: 'ASC' } });
  }

  findOneById(id: string): Promise<Exam | null> {
    return this.repo.findOneBy({ id });
  }

  findOneByName(name: string): Promise<Exam | null> {
    return this.repo.findOneBy({ name });
  }

  async create(data: Partial<Exam>): Promise<Exam> {
    const exam = this.repo.create(data);
    return this.repo.save(exam);
  }
}
