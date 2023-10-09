import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CodesModule } from 'src/modules/codes/codes.module';
import { ADAPTERS } from './core/adapters';
import { AH } from './commands';
import { UsersModule } from '../users/users.module';
import { SessionsModule } from '../sessions/sessions.module';
import { JwtService } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [CqrsModule, UsersModule, CodesModule, SessionsModule],
  providers: [AuthService, ...ADAPTERS, ...AH, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
