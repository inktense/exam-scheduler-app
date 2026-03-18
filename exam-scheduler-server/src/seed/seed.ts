// AI-GENERATED
import { UsersService } from '../users/users.service';

const TEST_USERS = [
  { username: 'alice', password: 'password123' },
  { username: 'bob', password: 'password123' },
];

export async function seedDatabase(usersService: UsersService): Promise<void> {
  // TODO: implement seeding
  //   — for each TEST_USERS entry:
  //     1. check if user already exists via usersService.findByUsername
  //     2. if not found, call usersService.register(username, password)
  //     3. log a message for each seeded / skipped user
  for (const _user of TEST_USERS) {
    // placeholder — will be implemented
  }
}
