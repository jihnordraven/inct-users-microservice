import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../modules/auth/auth.service';
import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { User } from '@prisma/client';

export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }

  public async validate(email: string, passw: string): Promise<User> {
    const user = await this.authService.validateUser(email, passw);
    if (!user) {
      throw new UnauthorizedException({
        message: 'Invalid login or password',
        error: 'Unauthorized',
        context: 'invalid-credentials',
        status: HttpStatus.UNAUTHORIZED,
      });
    }
    return user;
  }
}
