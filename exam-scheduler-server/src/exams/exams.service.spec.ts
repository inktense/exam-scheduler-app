// AI-GENERATED
import { ExamsService } from './exams.service';
import { ExamsRepository } from './exams.repository';
import { Exam } from './exam.entity';

const makeExam = (overrides: Partial<Exam> = {}): Exam => ({
  id: 'exam-1',
  name: 'CASI Level 1 – Snowboard Instructor Foundations',
  durationMinutes: 60,
  numberOfQuestions: 40,
  createdAt: new Date(),
  sessions: [],
  ...overrides,
});

describe('ExamsService', () => {
  let service: ExamsService;
  let repo: jest.Mocked<ExamsRepository>;

  beforeEach(() => {
    repo = {
      findAll: jest.fn(),
      findOneById: jest.fn(),
      findOneByName: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<ExamsRepository>;

    service = new ExamsService(repo);
  });

  describe('findAll', () => {
    it('returns all exams', async () => {
      const exams = [makeExam(), makeExam({ id: 'exam-2', name: 'CASI Level 2' })];
      repo.findAll.mockResolvedValue(exams);

      const result = await service.findAll();

      expect(repo.findAll).toHaveBeenCalled();
      expect(result).toEqual(exams);
    });
  });

  describe('findOneById', () => {
    it('returns the exam when found', async () => {
      const exam = makeExam();
      repo.findOneById.mockResolvedValue(exam);

      const result = await service.findOneById('exam-1');

      expect(repo.findOneById).toHaveBeenCalledWith('exam-1');
      expect(result).toEqual(exam);
    });

    it('returns null when exam does not exist', async () => {
      repo.findOneById.mockResolvedValue(null);

      const result = await service.findOneById('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('findOneByName', () => {
    it('returns the exam when found by name', async () => {
      const exam = makeExam();
      repo.findOneByName.mockResolvedValue(exam);

      const result = await service.findOneByName(exam.name);

      expect(repo.findOneByName).toHaveBeenCalledWith(exam.name);
      expect(result).toEqual(exam);
    });

    it('returns null when name does not match', async () => {
      repo.findOneByName.mockResolvedValue(null);

      const result = await service.findOneByName('Unknown Exam');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('creates and returns a new exam', async () => {
      const data = { name: 'IFSA Freeride Judge Certification', durationMinutes: 75, numberOfQuestions: 50 };
      const created = makeExam({ ...data, id: 'exam-3' });
      repo.create.mockResolvedValue(created);

      const result = await service.create(data);

      expect(repo.create).toHaveBeenCalledWith(data);
      expect(result.name).toBe(data.name);
      expect(result.durationMinutes).toBe(data.durationMinutes);
    });
  });
});
