// AI-GENERATED
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Exam } from '../exams/exam.entity';

export enum SessionStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELED = 'CANCELED',
}

@Entity('sessions')
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  examId: string;

  @ManyToOne(() => Exam, (exam) => exam.sessions)
  @JoinColumn({ name: 'examId' })
  exam: Exam;

  @Column({ type: 'timestamptz' })
  scheduledAt: Date;

  @Column({ type: 'enum', enum: SessionStatus, default: SessionStatus.SCHEDULED })
  status: SessionStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
