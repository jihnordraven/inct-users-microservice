import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ConfirmCommand } from './confirm.command';
import { CodesRepository } from '../../../codes/codes.repository';
import { Code, User } from '@prisma/client';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UsersRepository } from '../../../users/users.repository';

@CommandHandler(ConfirmCommand)
export class ConfirmHandler implements ICommandHandler<ConfirmCommand> {
  private readonly FRONTEND_HOST: string = String(process.env.FRONTEND_HOST);

  constructor(
    protected readonly codesRepo: CodesRepository,
    protected readonly usersRepo: UsersRepository,
  ) {}

  public async execute({ code, res }: ConfirmCommand): Promise<any> {
    const isCode: Code | null = await this.codesRepo.findById(code);
    if (!isCode) res.redirect(`${this.FRONTEND_HOST}/auth/expired`);

    const isCodeExpired: boolean = new Date() > new Date(isCode.expiresIn);
    if (isCodeExpired) res.redirect(`${this.FRONTEND_HOST}/auth/expired`);

    if (isCode.isUsed) res.redirect(`${this.FRONTEND_HOST}`);
  }
}
