import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { SessionsService } from '../../modules/sessions/sessions.service';

type JwtRefreshPayload = {
  userId: string;
  sessionId: string;
};

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private readonly SECRET = process.env.JWT_REFRESH_SECRET,
    private readonly sessionsService: SessionsService,
  ) {
    super({
      jwtFromRequest: (req: Request) => req.cookies['refreshToken'],
      secretOrKey: SECRET,
      ignoreExpiration: false,
    });
  }

  public async validate(
    payload: JwtRefreshPayload,
  ): Promise<JwtRefreshPayload> {
    const isSession: boolean = await this.sessionsService.validate(
      payload.sessionId,
    );
    if (!isSession) throw new UnauthorizedException();

    return { userId: payload.userId, sessionId: payload.sessionId };
  }
}
