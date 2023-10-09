import { ConfirmCommand } from './confirm/confirm.command';
import { ConfirmHandler } from './confirm/confirm.handler';

import { RegisterCommand } from './register/register.command';
import { RegisterHandler } from './register/register.handler';

import { ForgotPasswCommand } from './forgot-passw/forgot-passw.command';
import { ForgotPasswHandler } from './forgot-passw/forgot-passw.handler';

import { GenerateTokensCommand } from './generate-tokens/generate-tokens.command';
import { GenerateTokensHandler } from './generate-tokens/generate-tokens.handler';

export const AC = {
  RegisterCommand,
  ConfirmCommand,
  ForgotPasswCommand,
  GenerateTokensCommand,
};

export const AH = [
  RegisterHandler,
  ConfirmHandler,
  ForgotPasswHandler,
  GenerateTokensHandler,
];
