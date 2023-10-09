import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { RegisterCommand } from './register.command';
import { RegisterOutput } from './types';
import { Code, User } from '@prisma/client';
import { UsersRepository } from '../../../users/users.repository';
import { ConflictException } from '@nestjs/common';
import { hash } from 'bcrypt';
import { CodesRepository } from 'src/modules/codes/codes.repository';
import { MailerAdapter } from 'src/modules/auth/core/adapters';
import { RegisterConfirmHTML } from 'src/modules/auth/core/templates';

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
  private readonly HOST: string = process.env.HOST;

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly codesRepo: CodesRepository,
    private readonly mailerAdapter: MailerAdapter,
  ) {}

  public async execute({ data }: RegisterCommand): Promise<any> {
    const { email, login, passw } = data;

    const isUserEmail: User | null =
      await this.usersRepo.findUniqueByEmail(email);
    if (isUserEmail) throw new ConflictException();

    const isUserLogin: User | null =
      await this.usersRepo.findUniqueByLogin(login);
    if (isUserLogin) throw new ConflictException();

    const hashPassw: string = await hash(passw, 8);

    const user: User = await this.usersRepo.create({ email, login, hashPassw });

    const code: Code = await this.codesRepo.create({ userId: user.id });

    await this.mailerAdapter.sendMail({
      email,
      subject: 'Email Confirmation',
      html: RegisterConfirmHTML({ HOST: this.HOST, code: code.id }),
    });
  }
}
