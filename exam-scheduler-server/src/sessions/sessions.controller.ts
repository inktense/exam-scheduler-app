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

  // TODO: implement GET /api/sessions
  //   — returns all sessions for the authenticated user
  @Get()
  findAll(@CurrentUser() _user: User): Promise<SessionResponseDto[]> {
    throw new Error('Not implemented yet');
  }

  // TODO: implement POST /api/sessions
  //   — creates a session for the authenticated user, returns 201
  @Post()
  create(
    @CurrentUser() _user: User,
    @Body() _dto: CreateSessionDto,
  ): Promise<SessionResponseDto> {
    throw new Error('Not implemented yet');
  }

  // TODO: implement DELETE /api/sessions/:id
  //   — deletes session, returns 204 No Content
  //   — 404 if not found, 403 if belongs to another user
  @Delete(':id')
  @HttpCode(204)
  remove(
    @CurrentUser() _user: User,
    @Param('id') _id: string,
  ): Promise<void> {
    throw new Error('Not implemented yet');
  }
}
