// AI-GENERATED
import { UsersService } from '../users/users.service';
import { ExamsService } from '../exams/exams.service';

const TEST_USERS = [
  { username: 'alice', password: 'password123' },
  { username: 'bob', password: 'password123' },
];

const PREDEFINED_EXAMS = [
  { name: 'CASI Level 1 – Snowboard Instructor Foundations', durationMinutes: 60, numberOfQuestions: 40 },
  { name: 'CASI Level 2 – Snowboard Instructor Certification', durationMinutes: 90, numberOfQuestions: 55 },
  { name: 'CASI Level 3 – Advanced Snowboard Instructor', durationMinutes: 120, numberOfQuestions: 70 },
  { name: 'PSIA Level 1 – Freeride Ski Instructor', durationMinutes: 60, numberOfQuestions: 40 },
  { name: 'PSIA Level 2 – Freeride Technique & Terrain', durationMinutes: 90, numberOfQuestions: 55 },
  { name: 'IFSA Freeride Judge Certification', durationMinutes: 75, numberOfQuestions: 50 },
];

export async function seedDatabase(
  usersService: UsersService,
  examsService: ExamsService,
): Promise<void> {
  for (const { username, password } of TEST_USERS) {
    const existing = await usersService.findByUsername(username);
    if (existing) {
      console.log(`[seed] skipping user '${username}' — already exists`);
      continue;
    }
    await usersService.register(username, password);
    console.log(`[seed] created user '${username}'`);
  }

  for (const exam of PREDEFINED_EXAMS) {
    const existing = await examsService.findOneByName(exam.name);
    if (existing) {
      console.log(`[seed] skipping exam '${exam.name}' — already exists`);
      continue;
    }
    await examsService.create(exam);
    console.log(`[seed] created exam '${exam.name}'`);
  }
}
