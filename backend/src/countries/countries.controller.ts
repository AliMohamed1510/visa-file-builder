import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { RolesGuard } from '@auth/guards/roles.guard';
import { Roles } from '@auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@ApiTags('Countries')
@Controller('countries')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get all countries' })
  async findAll(@Query('schengen') schengen?: string, @Query('all') all?: string) {
    const where: any = {};
    if (schengen === 'true') where.isSchengen = true;
    return this.countriesService.findAll({ where, includeInactive: all === 'true' });
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MANAGER, UserRole.EMPLOYEE, UserRole.VIEWER)
  @ApiOperation({ summary: 'Get country by ID' })
  async findOne(@Param('id') id: string) {
    return this.countriesService.findById(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Create country' })
  async create(@Body() dto: CreateCountryDto) {
    return this.countriesService.create(dto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ summary: 'Update country' })
  async update(@Param('id') id: string, @Body() dto: UpdateCountryDto) {
    return this.countriesService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Delete country' })
  async remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
