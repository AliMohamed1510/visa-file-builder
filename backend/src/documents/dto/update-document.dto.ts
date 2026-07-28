import { IsString, IsOptional, IsEnum, IsJSON } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DocumentType, DocumentStatus } from '@prisma/client';

export class UpdateDocumentDto {
  @ApiPropertyOptional({ enum: DocumentType })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @ApiPropertyOptional({ enum: DocumentStatus })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  ocrData?: any;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  verificationNotes?: string;
}
