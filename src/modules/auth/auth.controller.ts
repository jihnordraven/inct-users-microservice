import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RegisterDTO } from './core/dtos';
import { AC } from './commands';
import { Request, Response } from 'express';
import { Public } from './core/decorators/public.decorator';
import { JwtRefreshGuard } from '../../guards-handlers/guards';
import { JwtAccessPayloadDecorator, UserAgent } from './core/decorators';
import { Tokens } from './commands/generate-tokens/generate-tokens.handler';
import { User } from '@prisma/client';
import { MeType } from './core/types';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('register')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async register(@Body() dto: RegisterDTO): Promise<void> {
    await this.commandBus.execute(new AC.RegisterCommand(dto));
  }

  @Post('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirm(
    @Query('code', ParseUUIDPipe) code: string,
    @Res() res: Response,
  ): Promise<void> {
    await this.commandBus.execute(new AC.ConfirmCommand(code, res));
  }

  @Post('confirm-resend')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async confirmResend(): Promise<void> {}

  @Post('forgot-passw')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async forgotPassw(@Body('email') email: string): Promise<void> {
    await this.commandBus.execute(new AC.ForgotPasswCommand(email));
  }

  @Post('forgot-passw-confirm')
  public async forgotPasswConfirm() {}

  @Post('forgot-passw-resend')
  public async forgotPasswResend() {}

  @Post('set-new-passw')
  public async setNewPassw() {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  public async login(
    @Req() req: Request,
    @Ip() userIp: string,
    @UserAgent() agent: string,
    @Res() res: Response,
  ): Promise<any> {
    // @ts-ignore
    const user: User = req.user;
    const tokens: Tokens = await this.commandBus.execute(
      new AC.GenerateTokensCommand({ userId: user.id, userIp, agent }),
    );
    return this.setTokensToReponse(tokens, res);
  }

  @Post('refresh-tokens')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  public async refreshTokens(
    @Req() req: Request,
    @Ip() userIp: string,
    @UserAgent() agent: string,
    @Res() res: Response,
  ): Promise<any> {
    // @ts-ignore
    const userId: string = req.user;
    const tokens: Tokens = await this.commandBus.execute(
      new AC.GenerateTokensCommand({ userId, userIp, agent }),
    );
    return this.setTokensToReponse(tokens, res);
  }

  @Get('me')
  public async me(@JwtAccessPayloadDecorator() user: User): Promise<MeType> {
    return {
      userId: user.id,
      email: user.email,
      login: user.login,
    };
  }

  // Helpers
  private setTokensToReponse(tokens: Tokens, res: Response): void {
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      expires: new Date(process.env.JWT_REFRESH_EXPIRES),
    });
  }
}
