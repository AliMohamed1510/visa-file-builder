import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { Country, Prisma } from '@prisma/client';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params?: { where?: Prisma.CountryWhereInput; includeInactive?: boolean }): Promise<Country[]> {
    return this.prisma.country.findMany({
      where: params?.includeInactive ? params.where : { ...params?.where, isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string): Promise<Country | null> {
    return this.prisma.country.findUnique({ where: { id } });
  }

  async findByCode(code: string): Promise<Country | null> {
    return this.prisma.country.findUnique({ where: { code: code.toUpperCase() } });
  }

  async create(data: CreateCountryDto): Promise<Country> {
    return this.prisma.country.create({
      data: { ...data, code: data.code.toUpperCase() },
    });
  }

  async update(id: string, data: UpdateCountryDto): Promise<Country> {
    const country = await this.findById(id);
    if (!country) throw new NotFoundException('Country not found');
    return this.prisma.country.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Country> {
    return this.prisma.country.delete({ where: { id } });
  }
}
