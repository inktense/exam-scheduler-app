// AI-GENERATED
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { BasicAuthGuard } from '../auth/basic-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/user.entity';
import { CreateSessionDto } from './dto/create-session.dto';
import { SessionResponseDto } from './dto/session-response.dto';


@Controller('sessions')
@UseGuards(BasicAuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Get()
  findAll(@CurrentUser() user: User): Promise<SessionResponseDto[]> {
    return this.sessionsService.findAllByUser(user.id);
  }

  @Post()
  @HttpCode(201)
  create(
    @CurrentUser() user: User,
    @Body() dto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    return this.sessionsService.create(user.id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@CurrentUser() user: User, @Param('id') id: string): Promise<void> {
    return this.sessionsService.remove(id, user.id);
  }
}
