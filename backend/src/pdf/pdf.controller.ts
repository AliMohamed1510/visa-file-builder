import { Controller, Post, Get, Param, Res, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiProduces } from '@nestjs/swagger';
import { PdfService } from './pdf.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Response } from 'express';

@ApiTags('PDF')
@Controller('pdf')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('generate/:applicationId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Generate complete visa file PDF' })
  async generateVisaFile(@Param('applicationId') applicationId: string) {
    const filePath = await this.pdfService.generateVisaFile(applicationId);
    return { success: true, filePath };
  }

  @Get('preview/:applicationId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Preview visa form as PDF' })
  @ApiProduces('application/pdf')
  async previewForm(@Param('applicationId') applicationId: string, @Res() res: Response) {
    const buffer = await this.pdfService.generateFormPreview(applicationId);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="preview-${applicationId}.pdf"`);
    res.send(buffer);
  }
}
