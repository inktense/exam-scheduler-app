// AI-GENERATED
import { UsersService } from '../users/users.service';

const TEST_USERS = [
  { username: 'alice', password: 'password123' },
  { username: 'bob', password: 'password123' },
];

export async function seedDatabase(usersService: UsersService): Promise<void> {
  for (const { username, password } of TEST_USERS) {
    const existing = await usersService.findByUsername(username);
    if (existing) {
      console.log(`[seed] skipping '${username}' — already exists`);
      continue;
    }
    await usersService.register(username, password);
    console.log(`[seed] created user '${username}'`);
  }
}
