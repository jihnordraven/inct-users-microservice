import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { memoryStore } from 'cache-manager';
import { CodesModule } from './modules/codes/codes.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAccessGuard } from './guards-handlers/guards';
import { PrismaModule } from 'prisma/prisma.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    CacheModule.register({
      isGlobal: true,
      store: memoryStore,
    }),
    PrismaModule,
    CodesModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAccessGuard,
    },
  ],
})
export class AppModule {}
