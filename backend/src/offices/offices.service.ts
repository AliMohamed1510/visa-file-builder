import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { Office } from '@prisma/client';
import { CreateOfficeDto } from './dto/create-office.dto';
import { UpdateOfficeDto } from './dto/update-office.dto';

@Injectable()
export class OfficesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Office[]> {
    return this.prisma.office.findMany({
      where: { isActive: true },
      include: { _count: { select: { employees: true, users: true } } },
    });
  }

  async findById(id: string): Promise<Office | null> {
    return this.prisma.office.findUnique({
      where: { id },
      include: { employees: { include: { user: true } }, users: true },
    });
  }

  async create(data: CreateOfficeDto): Promise<Office> {
    return this.prisma.office.create({ data });
  }

  async update(id: string, data: UpdateOfficeDto): Promise<Office> {
    const office = await this.findById(id);
    if (!office) throw new NotFoundException('Office not found');
    return this.prisma.office.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Office> {
    return this.prisma.office.delete({ where: { id } });
  }
}
