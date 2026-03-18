// AI-GENERATED
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsRepository } from './sessions.repository';
import { Session, SessionStatus } from './session.entity';

const makeSession = (overrides: Partial<Session> = {}): Session => ({
  id: 'session-1',
  userId: 'user-1',
  examName: 'AWS Solutions Architect',
  scheduledAt: new Date('2099-01-01T10:00:00Z'),
  durationMinutes: 130,
  status: SessionStatus.SCHEDULED,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: null,
  ...overrides,
});

describe('SessionsService', () => {
  let service: SessionsService;
  let repo: jest.Mocked<SessionsRepository>;

  beforeEach(() => {
    repo = {
      findAllByUserId: jest.fn(),
      findOneById: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
    } as jest.Mocked<SessionsRepository>;

    service = new SessionsService(repo);
  });

  describe('findAllByUser', () => {
    it('returns only sessions belonging to the given user', async () => {
      const sessions = [makeSession(), makeSession({ id: 'session-2' })];
      repo.findAllByUserId.mockResolvedValue(sessions);

      const result = await service.findAllByUser('user-1');

      expect(repo.findAllByUserId).toHaveBeenCalledWith('user-1');
      expect(result).toEqual(sessions);
    });
  });

  describe('create', () => {
    it('creates a session with the correct userId', async () => {
      const dto = {
        examName: 'AWS Solutions Architect',
        scheduledAt: '2099-06-01T10:00:00Z',
        durationMinutes: 130,
      };
      const created = makeSession({ userId: 'user-1' });
      repo.create.mockResolvedValue(created);

      const result = await service.create('user-1', dto);

      expect(repo.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: 'user-1', examName: dto.examName }),
      );
      expect(result.userId).toBe('user-1');
    });

    it('throws BadRequestException when scheduledAt is in the past', () => {
      const dto = {
        examName: 'AWS Solutions Architect',
        scheduledAt: '2000-01-01T10:00:00Z',
        durationMinutes: 130,
      };

      expect(() => service.create('user-1', dto)).toThrow(BadRequestException);
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
