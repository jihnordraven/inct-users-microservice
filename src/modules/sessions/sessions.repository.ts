import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Session } from '@prisma/client';
import { Cache } from 'cache-manager';
import { PrismaService } from 'prisma/prisma.service';
import { CreateSessionType } from './types/create-session.type';
import { add } from 'date-fns';

@Injectable()
export class SessionsRepository {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prisma: PrismaService,
  ) {}

  public async create(data: CreateSessionType): Promise<Session> {
    return this.prisma.session.create({
      data: {
        ...data,
        expiresIn: add(new Date(), {
          seconds: +process.env.JWT_REFRESH_EXPIRES,
        }),
      },
    });
  }

  public async findById(id: string): Promise<Session | null> {
    const session: Session | null = await this.cache.get(`session-id-${id}`);
    if (!session) {
      const session: Session | null = await this.prisma.session.findUnique({
        where: { id },
      });
      if (!session) return null;
      await this.cache.set(`session-id-${id}`, session, 1800);
      return session;
    }
    return session;
  }

  public async deleteById(id: string): Promise<void> {
    await this.prisma.session.delete({ where: { id } });
  }
}
