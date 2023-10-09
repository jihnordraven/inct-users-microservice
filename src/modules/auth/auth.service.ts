import { ForbiddenException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { User } from '@prisma/client';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly usersRepo: UsersRepository) {}

  public async validateUser(email: string, passw: string): Promise<User> {
    const user: User | null = await this.usersRepo.findUniqueByEmail(email);
    if (!user) return null;

    const isValidPassw: boolean = Boolean(await compare(passw, user.hashPassw));
    if (!isValidPassw) return null;

    if (user.isBlocked) {
      throw new ForbiddenException({
        message: 'Your account has been blocked',
        error: 'Forbidden',
        context: 'account-blocked',
        status: HttpStatus.FORBIDDEN,
      });
    }
    if (!user.isVerified) {
      throw new ForbiddenException({
        message: 'You have to verify your account',
        error: 'Forbidden',
        context: 'account-not-verified',
        status: HttpStatus.FORBIDDEN,
      });
    }

    return user;
  }
}
