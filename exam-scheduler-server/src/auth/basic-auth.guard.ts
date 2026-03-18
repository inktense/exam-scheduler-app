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

    if (!authHeader?.startsWith('Basic ')) {
      throw new UnauthorizedException('Missing or invalid Authorization header');
    }

    const base64 = authHeader.slice('Basic '.length);
    const decoded = Buffer.from(base64, 'base64').toString('utf-8');

    // Split on first ':' only — passwords may contain colons
    const colonIndex = decoded.indexOf(':');
    if (colonIndex === -1) {
      throw new UnauthorizedException('Malformed credentials');
    }
    const username = decoded.slice(0, colonIndex);
    const password = decoded.slice(colonIndex + 1);

    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    req['user'] = user;
    return true;
  }
}
