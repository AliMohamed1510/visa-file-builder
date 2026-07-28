import { Module } from '@nestjs/common';
import { VisaApplicationsService } from './visa-applications.service';
import { VisaApplicationsController } from './visa-applications.controller';

@Module({
  providers: [VisaApplicationsService],
  controllers: [VisaApplicationsController],
  exports: [VisaApplicationsService],
})
export class VisaApplicationsModule {}
