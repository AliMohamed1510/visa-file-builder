import { PartialType } from '@nestjs/swagger';
import { CreateVisaApplicationDto } from './create-visa-application.dto';

export class UpdateVisaApplicationDto extends PartialType(CreateVisaApplicationDto) {}
