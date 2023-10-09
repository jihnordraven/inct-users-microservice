import { RegisterInput } from './types';

export class RegisterCommand {
  constructor(public readonly data: RegisterInput) {}
}
