import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { Client, Prisma } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.ClientWhereInput;
    orderBy?: Prisma.ClientOrderByWithRelationInput;
    include?: Prisma.ClientInclude;
  }): Promise<Client[]> {
    return this.prisma.client.findMany(params);
  }

  async count(where?: Prisma.ClientWhereInput): Promise<number> {
    return this.prisma.client.count({ where });
  }

  async findById(id: string, includeRelations = false): Promise<Client | null> {
    return this.prisma.client.findUnique({
      where: { id },
      include: includeRelations
        ? {
            documents: { orderBy: { createdAt: 'desc' } },
            visaApplications: { orderBy: { createdAt: 'desc' } },
            office: { select: { id: true, name: true } },
            createdBy: { select: { id: true, firstName: true, lastName: true } },
          }
        : undefined,
    });
  }

  async findByPassport(passportNumber: string): Promise<Client | null> {
    return this.prisma.client.findFirst({
      where: { passportNumber: { equals: passportNumber, mode: 'insensitive' } },
    });
  }

  async create(data: CreateClientDto & { createdById: string }): Promise<Client> {
    return this.prisma.client.create({ data });
  }

  async update(id: string, data: UpdateClientDto): Promise<Client> {
    const client = await this.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return this.prisma.client.update({ where: { id }, data });
  }

  async remove(id: string): Promise<Client> {
    const client = await this.findById(id);
    if (!client) {
      throw new NotFoundException('Client not found');
    }
    return this.prisma.client.delete({ where: { id } });
  }

  async search(query: string): Promise<Client[]> {
    return this.prisma.client.findMany({
      where: {
        OR: [
          { firstName: { contains: query, mode: 'insensitive' } },
          { lastName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { passportNumber: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query } },
        ],
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });
  }
}
