// AI-GENERATED
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    // TODO: implement credential extraction and bcrypt comparison
    // 1. Decode base64: Buffer.from(base64Part, 'base64').toString('utf-8')
    // 2. Split on first ':' only (passwords may contain colons)
    // 3. usersService.findByUsername(username)
    // 4. bcrypt.compare(password, user.passwordHash)
    // 5. req['user'] = user

    throw new UnauthorizedException('Not implemented yet');
  }
}
