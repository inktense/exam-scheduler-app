// AI-GENERATED
import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

// Public endpoint — no BasicAuthGuard applied here
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: implement POST /api/users/register
  //   — calls usersService.register(dto.username, dto.password)
  //   — returns 201 with UserResponseDto (never expose passwordHash)
  @Post('register')
  register(@Body() _dto: RegisterUserDto): Promise<UserResponseDto> {
    throw new Error('Not implemented yet');
  }
}
