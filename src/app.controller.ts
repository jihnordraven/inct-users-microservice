import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/core/decorators/public.decorator';

@Public()
@Controller()
export class AppController {
  @Get()
  getHello(): string {
    return 'Server works';
  }
}
