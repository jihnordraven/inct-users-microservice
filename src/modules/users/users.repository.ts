import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from 'prisma/prisma.service';
import { CreateUserType } from './types';

@Injectable()
export class UsersRepository {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prisma: PrismaService,
  ) {}

  public async create(body: CreateUserType): Promise<User> {
    return this.prisma.user.create({
      data: { ...body },
    });
  }

  public async findUniqueByEmail(email: string): Promise<User | null> {
    const user: User | null = await this.cache.get<User>(`user-email-${email}`);
    if (!user) {
      const user: User | null = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!user) return null;
      await this.cache.set(`user-email-${email}`, user, 1800);
      return user;
    }
    return user;
  }

  public async findUniqueByLogin(login: string): Promise<User | null> {
    const user: User | null = await this.cache.get<User>(`user-login-${login}`);
    if (!user) {
      const user: User | null = await this.prisma.user.findUnique({
        where: { login },
      });
      if (!user) return null;
      await this.cache.set(`user-login-${login}`, user, 1800);
      return user;
    }
    return user;
  }

  public async findUniqueById(id: string): Promise<User | null> {
    const user: User | null = await this.cache.get<User>(`user-id-${id}`);
    if (!user) {
      const user: User | null = await this.prisma.user.findUnique({
        where: { id },
      });
      if (!user) return null;
      await this.cache.set(`user-id-${id}`, user, 1800);
      return user;
    }
    return user;
  }
}
