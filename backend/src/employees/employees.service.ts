import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { Employee } from '@prisma/client';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class EmployeesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(officeId?: string): Promise<Employee[]> {
    return this.prisma.employee.findMany({
      where: officeId ? { officeId } : undefined,
      include: { user: { select: { id: true, email: true, firstName: true, lastName: true, role: true, status: true } } },
    });
  }

  async findById(id: string): Promise<Employee | null> {
    return this.prisma.employee.findUnique({
      where: { id },
      include: { user: true, office: true },
    });
  }

  async create(data: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data,
      include: { user: true, office: true },
    });
  }

  async update(id: string, data: UpdateEmployeeDto): Promise<Employee> {
    const emp = await this.findById(id);
    if (!emp) throw new NotFoundException('Employee not found');
    return this.prisma.employee.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Employee> {
    return this.prisma.employee.delete({ where: { id } });
  }
}
