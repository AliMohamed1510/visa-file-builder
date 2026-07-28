import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OcrService } from './ocr.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('OCR')
@Controller('ocr')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('passport')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Extract passport data via OCR' })
  async extractPassport(@Body('filePath') filePath: string) {
    return this.ocrService.extractPassportData(filePath);
  }

  @Post('hotel')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Extract hotel booking data via OCR' })
  async extractHotel(@Body('filePath') filePath: string) {
    return this.ocrService.extractHotelBooking(filePath);
  }

  @Post('flight')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Extract flight booking data via OCR' })
  async extractFlight(@Body('filePath') filePath: string) {
    return this.ocrService.extractFlightBooking(filePath);
  }
}
