import { IsString, IsOptional, IsBoolean, IsEnum, IsJSON } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SchengenCountry } from '@prisma/client';

export class CreateCountryDto {
  @ApiProperty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() nameAr?: string;
  @ApiProperty() @IsString() code: string;
  @ApiPropertyOptional({ enum: SchengenCountry }) @IsOptional() @IsEnum(SchengenCountry) schengenCountry?: SchengenCountry;
  @ApiPropertyOptional() @IsOptional() formTemplate?: any;
  @ApiPropertyOptional() @IsOptional() documentRequirements?: any;
  @ApiPropertyOptional() @IsOptional() validationRules?: any;
  @ApiPropertyOptional() @IsOptional() fieldOrder?: any;
  @ApiPropertyOptional({ default: true }) @IsOptional() @IsBoolean() isActive?: boolean;
  @ApiPropertyOptional({ default: false }) @IsOptional() @IsBoolean() isSchengen?: boolean;
}
