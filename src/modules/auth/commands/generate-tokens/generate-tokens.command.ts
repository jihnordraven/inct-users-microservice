export class GenerateTokensCommand {
  constructor(
    public readonly data: { userId: string; userIp: string; agent: string },
  ) {}
}
