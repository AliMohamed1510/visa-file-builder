import { Module } from '@nestjs/common';
import { OfficesService } from './offices.service';
import { OfficesController } from './offices.controller';

@Module({
  providers: [OfficesService],
  controllers: [OfficesController],
  exports: [OfficesService],
})
export class OfficesModule {}
