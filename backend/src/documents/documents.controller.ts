import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { DocumentsService } from './documents.service';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserRole, DocumentType, DocumentStatus } from '@prisma/client';
import { createPaginatedResponse, createPaginationOptions } from '@common/utils/pagination.util';

@ApiTags('Documents')
@Controller('documents')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all documents' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('clientId') clientId?: string,
    @Query('type') type?: DocumentType,
    @Query('status') status?: DocumentStatus,
  ) {
    const where: any = {};
    if (clientId) where.clientId = clientId;
    if (type) where.type = type;
    if (status) where.status = status;

    const [documents, total] = await Promise.all([
      this.documentsService.findAll({ ...createPaginationOptions({ page, limit }), where }),
      this.documentsService.count(where),
    ]);

    return createPaginatedResponse(documents, total, { page, limit });
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get document by ID' })
  async findOne(@Param('id') id: string) {
    return this.documentsService.findById(id);
  }

  @Post('upload')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Upload document' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        clientId: { type: 'string' },
        type: { type: 'string', enum: Object.values(DocumentType) },
        visaApplicationId: { type: 'string' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body('clientId') clientId: string,
    @Body('type') type: DocumentType,
    @Body('visaApplicationId') visaApplicationId?: string,
  ) {
    if (!file) throw new BadRequestException('No file provided');
    if (!clientId) throw new BadRequestException('Client ID is required');
    if (!type) throw new BadRequestException('Document type is required');

    return this.documentsService.uploadFile(file, { clientId, type, visaApplicationId });
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update document' })
  async update(@Param('id') id: string, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(id, dto);
  }

  @Patch(':id/verify')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Verify document' })
  async verify(
    @Param('id') id: string,
    @Body('status') status: DocumentStatus,
    @Body('notes') notes?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.documentsService.verifyDocument(id, status, notes, userId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete document' })
  async remove(@Param('id') id: string) {
    return this.documentsService.remove(id);
  }
}
