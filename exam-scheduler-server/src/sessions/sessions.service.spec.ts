// AI-GENERATED
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { Session, SessionStatus } from './session.entity';
import { ExamsService } from '../exams/exams.service';
import { Exam } from '../exams/exam.entity';

const makeExam = (overrides: Partial<Exam> = {}): Exam => ({
  id: 'exam-1',
  name: 'CASI Level 1 – Snowboard Instructor Foundations',
  durationMinutes: 60,
  numberOfQuestions: 40,
  createdAt: new Date(),
  sessions: [],
  ...overrides,
});

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'session-1',
  userId: 'user-1',
  examId: 'exam-1',
  exam: makeExam(),
  scheduledAt: new Date('2099-01-01T10:00:00Z'),
  status: SessionStatus.SCHEDULED,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: null as unknown as import('../users/user.entity').User,
  ...overrides,
});

describe('SessionsService', () => {
  let service: SessionsService;
  let repo: jest.Mocked<SessionsRepository>;
  let examsService: jest.Mocked<ExamsService>;

  beforeEach(() => {
    repo = {
      findAllByUserId: jest.fn(),
      findOneById: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    } as unknown as jest.Mocked<SessionsRepository>;

    examsService = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findOneByName: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<ExamsService>;

    service = new SessionsService(repo, examsService);
  });

  describe('findAllByUser', () => {
    it('returns only sessions belonging to the given user', async () => {
      const sessions = [makeSession(), makeSession({ id: 'session-2' })];
      repo.findAllByUserId.mockResolvedValue(sessions);

      const result = await service.findAllByUser('user-1');

      expect(repo.findAllByUserId).toHaveBeenCalledWith('user-1');
      expect(result).toHaveLength(2);
      expect(result[0].examName).toBe(sessions[0].exam.name);
      expect(result[0].durationMinutes).toBe(sessions[0].exam.durationMinutes);
    });
  });

  describe('create', () => {
    it('creates a session with the correct userId and examId', async () => {
      const dto = { examId: 'exam-1', scheduledAt: '2099-06-01T10:00:00Z' };
      const exam = makeExam();
      const created = makeSession({ userId: 'user-1', examId: 'exam-1' });

      examsService.findOneById.mockResolvedValue(exam);
      repo.create.mockResolvedValue(created);

      const result = await service.create('user-1', dto);

      expect(examsService.findOneById).toHaveBeenCalledWith('exam-1');
      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', examId: 'exam-1' }),
      );
      expect(result.examId).toBe('exam-1');
    });

    it('throws BadRequestException when scheduledAt is in the past', async () => {
      const dto = { examId: 'exam-1', scheduledAt: '2000-01-01T10:00:00Z' };

      await expect(service.create('user-1', dto)).rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when examId does not exist', async () => {
      const dto = { examId: 'nonexistent', scheduledAt: '2099-06-01T10:00:00Z' };
      examsService.findOneById.mockResolvedValue(null);

      await expect(service.create('user-1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('throws NotFoundException when session does not exist', async () => {
      repo.findOneById.mockResolvedValue(null);

      await expect(service.remove('nonexistent-id', 'user-1')).rejects.toThrow(NotFoundException);
    });

    it('throws ForbiddenException when session belongs to another user', async () => {
      repo.findOneById.mockResolvedValue(makeSession({ userId: 'other-user' }));

      await expect(service.remove('session-1', 'user-1')).rejects.toThrow(ForbiddenException);
    });

    it('deletes the session when it belongs to the authenticated user', async () => {
      const session = makeSession({ userId: 'user-1' });
      repo.findOneById.mockResolvedValue(session);
      repo.remove.mockResolvedValue(undefined);

      await service.remove('session-1', 'user-1');

      expect(repo.remove).toHaveBeenCalledWith(session);
    });
  });
});
