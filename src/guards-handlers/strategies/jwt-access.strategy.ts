import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { User } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from '../../modules/users/users.repository';

type JwtAccessPayload = {
  userId: string;
};

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    private readonly SECRET = process.env.JWT_ACCESS_SECRET,
    private readonly usersRepo: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: SECRET,
      ignoreExpiration: false,
    });
  }

  public async validate(payload: JwtAccessPayload): Promise<User> {
    const user: User | null = await this.usersRepo.findUniqueById(
      payload.userId,
    );
    if (!user) throw new NotFoundException("User doesn't exist");
    return user;
  }
}
