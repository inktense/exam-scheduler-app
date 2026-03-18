// AI-GENERATED
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

// Public endpoint — BasicAuthGuard is NOT applied here
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @HttpCode(201)
  async register(@Body() dto: RegisterUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.register(dto.username, dto.password);
    return {
      id: user.id,
      username: user.username,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
