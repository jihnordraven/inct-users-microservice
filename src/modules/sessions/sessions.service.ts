import { Injectable } from '@nestjs/common';
import { SessionsRepository } from './sessions.repository';
import { Session } from '@prisma/client';

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsRepo: SessionsRepository) {}

  public async validate(id: string): Promise<boolean> {
    const session: Session | null = await this.sessionsRepo.findById(id);
    if (!session) return null;

    if (new Date() > new Date(session.expiresIn)) {
      await this.sessionsRepo.deleteById(id);
      return null;
    }

    return true;
  }
}
