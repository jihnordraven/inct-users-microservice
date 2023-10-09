import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForgotPasswCommand } from './forgot-passw.command';
import { Code, User } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';
import { CodesRepository } from 'src/modules/codes/codes.repository';
import { MailerAdapter } from 'src/modules/auth/core/adapters';
import { passwRecoveryHTML } from 'src/modules/auth/core/templates';
import { UsersRepository } from 'src/modules/users/users.repository';

@CommandHandler(ForgotPasswCommand)
export class ForgotPasswHandler implements ICommandHandler<ForgotPasswCommand> {
  private readonly HOST: string = String(process.env.HOST);

  constructor(
    protected readonly usersRepo: UsersRepository,
    protected readonly codesRepo: CodesRepository,
    protected readonly mailerAdapter: MailerAdapter,
  ) {}

  public async execute({ email }: ForgotPasswCommand): Promise<void> {
    const isUserEmail: User | null =
      await this.usersRepo.findUniqueByEmail(email);

    if (!isUserEmail) throw new NotFoundException();

    const code: Code = await this.codesRepo.create({ userId: isUserEmail.id });

    await this.mailerAdapter.sendMail({
      email,
      subject: 'Password Recovery',
      html: passwRecoveryHTML({ HOST: this.HOST, code: code.id }),
    });
  }
}
