import { Module } from '@nestjs/common';
import { CodesService } from './codes.service';
import { CodesController } from './codes.controller';
import { CodesRepository } from './codes.repository';

@Module({
  controllers: [CodesController],
  providers: [CodesService, CodesRepository],
  exports: [CodesRepository],
})
export class CodesModule {}
