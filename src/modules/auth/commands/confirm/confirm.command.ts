import { Response } from 'express';

export class ConfirmCommand {
  constructor(
    public readonly code: string,
    public readonly res: Response,
  ) {}
}
