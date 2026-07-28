import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { VisaApplicationsService } from './visa-applications.service';
import { CreateVisaApplicationDto } from './dto/create-visa-application.dto';
import { UpdateVisaApplicationDto } from './dto/update-visa-application.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { CurrentUser } from '@auth/decorators/current-user.decorator';
import { UserRole, VisaStatus } from '@prisma/client';
import { createPaginatedResponse, createPaginationOptions } from '@common/utils/pagination.util';

@ApiTags('Visa Applications')
@Controller('visa-applications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class VisaApplicationsController {
  constructor(private readonly visaApplicationsService: VisaApplicationsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all visa applications' })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('clientId') clientId?: string,
    @Query('countryId') countryId?: string,
    @Query('search') search?: string,
  ) {
    const where: any = {};
    if (status) where.status = status;
    if (clientId) where.clientId = clientId;
    if (countryId) where.destinationCountryId = countryId;

    const [applications, total] = await Promise.all([
      this.visaApplicationsService.findAll({
        ...createPaginationOptions({ page, limit }),
        where,
      }),
      this.visaApplicationsService.count(where),
    ]);

    return createPaginatedResponse(applications, total, { page, limit });
  }

  @Get('statistics')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Get visa application statistics' })
  async getStatistics() {
    return this.visaApplicationsService.getStatistics();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get visa application by ID' })
  async findOne(@Param('id') id: string) {
    return this.visaApplicationsService.findById(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Create visa application' })
  async create(@Body() dto: CreateVisaApplicationDto, @CurrentUser('sub') userId: string) {
    return this.visaApplicationsService.create({ ...dto, createdById: userId });
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Update visa application' })
  async update(@Param('id') id: string, @Body() dto: UpdateVisaApplicationDto) {
    return this.visaApplicationsService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER)
  @ApiOperation({ summary: 'Update visa application status' })
  async updateStatus(
    @Param('id') id: string,
    @Body('status') status: VisaStatus,
    @Body('reviewNotes') reviewNotes?: string,
    @CurrentUser('sub') userId?: string,
  ) {
    return this.visaApplicationsService.updateStatus(id, status, reviewNotes, userId);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete visa application' })
  async remove(@Param('id') id: string) {
    return this.visaApplicationsService.remove(id);
  }
}
