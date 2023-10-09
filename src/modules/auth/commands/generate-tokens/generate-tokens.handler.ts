import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { GenerateTokensCommand } from './generate-tokens.command';
import { JwtService } from '@nestjs/jwt';
import { Session } from '@prisma/client';
import { SessionsRepository } from '../../../../modules/sessions/sessions.repository';

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

@CommandHandler(GenerateTokensCommand)
export class GenerateTokensHandler
  implements ICommandHandler<GenerateTokensCommand>
{
  private readonly JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
  private readonly JWT_ACCESS_EXPIRE = process.env.JWT_ACCESS_EXPIRE;

  private readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
  private readonly JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE;

  constructor(
    protected readonly jwt: JwtService,
    protected readonly sessionsRepo: SessionsRepository,
  ) {}

  public async execute({ data }: GenerateTokensCommand): Promise<Tokens> {
    const session: Session = await this.sessionsRepo.create(data);

    const accessToken: string = this.jwt.sign(
      { userId: data.userId },
      { secret: this.JWT_ACCESS_SECRET, expiresIn: +this.JWT_ACCESS_EXPIRE },
    );

    const refreshToken: string = this.jwt.sign(
      { userId: data.userId, sessionId: session.id },
      { secret: this.JWT_REFRESH_SECRET, expiresIn: this.JWT_REFRESH_EXPIRE },
    );

    return { accessToken, refreshToken };
  }
}
