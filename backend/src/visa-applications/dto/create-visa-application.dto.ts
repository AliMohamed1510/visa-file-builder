import { IsString, IsOptional, IsUUID, IsEnum, IsDateString, IsInt, IsBoolean, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationType, VisaStatus } from '@prisma/client';

export class CreateVisaApplicationDto {
  @ApiProperty({ enum: ApplicationType, default: ApplicationType.TOURISM })
  @IsEnum(ApplicationType)
  applicationType: ApplicationType;

  @ApiProperty() @IsUUID() destinationCountryId: string;
  @ApiProperty() @IsUUID() clientId: string;

  @ApiPropertyOptional() @IsOptional() @IsString() entryType?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() durationOfStay?: number;
  @ApiPropertyOptional() @IsOptional() @IsDateString() intendedDateOfEntry?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() intendedDateOfExit?: string;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() hasPreviousVisas?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() previousVisaDetails?: string;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() hasSponsor?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsString() sponsorName?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sponsorAddress?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() sponsorPhone?: string;
  @ApiPropertyOptional() @IsOptional() formData?: any;
}
