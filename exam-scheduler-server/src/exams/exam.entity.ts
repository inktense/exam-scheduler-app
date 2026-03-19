// AI-GENERATED
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Session } from '../sessions/session.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'int' })
  durationMinutes: number;

  @Column({ type: 'int' })
  numberOfQuestions: number;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Session, (session) => session.exam)
  sessions: Session[];
}
