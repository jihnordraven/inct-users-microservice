import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Code } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { CreateCodeType } from './types';
import { add } from 'date-fns';
import { Cache } from 'cache-manager';

@Injectable()
export class CodesRepository {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cache: Cache,
    private readonly prisma: PrismaService,
  ) {}

  public async create(data: CreateCodeType): Promise<Code> {
    return this.prisma.code.create({
      data: {
        userId: data.userId,
        expiresIn: add(new Date(), { months: 10 }),
      },
    });
  }

  public async findById(id: string): Promise<Code> {
    const code: Code | null = await this.cache.get<Code>(`code-id-${id}`);
    if (!code) {
      const code: Code | null = await this.prisma.code.findUnique({
        where: { id },
      });
      if (!code) return null;
      await this.cache.set(`code-id-${id}`, code, 1800);
      return code;
    }
    return code;
  }

  public async deactivateById(id: string): Promise<void> {
    await this.prisma.code.update({ where: { id }, data: { isUsed: true } });
  }
}
