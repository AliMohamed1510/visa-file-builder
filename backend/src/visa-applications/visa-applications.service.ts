import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@common/prisma.service';
import { VisaApplication, VisaStatus, Prisma } from '@prisma/client';
import { CreateVisaApplicationDto } from './dto/create-visa-application.dto';
import { UpdateVisaApplicationDto } from './dto/update-visa-application.dto';
import { format } from 'date-fns';

@Injectable()
export class VisaApplicationsService {
  constructor(private readonly prisma: PrismaService) {}

  private generateApplicationNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(10000 + Math.random() * 90000);
    return `VISA-${year}-${random}`;
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.VisaApplicationWhereInput;
    orderBy?: Prisma.VisaApplicationOrderByWithRelationInput;
  }): Promise<VisaApplication[]> {
    return this.prisma.visaApplication.findMany({
      ...params,
      include: {
        client: { select: { id: true, firstName: true, lastName: true, passportNumber: true } },
        destinationCountry: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { documents: true } },
      },
    });
  }

  async count(where?: Prisma.VisaApplicationWhereInput): Promise<number> {
    return this.prisma.visaApplication.count({ where });
  }

  async findById(id: string): Promise<VisaApplication | null> {
    return this.prisma.visaApplication.findUnique({
      where: { id },
      include: {
        client: true,
        destinationCountry: true,
        documents: true,
        createdBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async create(data: CreateVisaApplicationDto & { createdById: string }): Promise<VisaApplication> {
    const applicationNumber = this.generateApplicationNumber();
    return this.prisma.visaApplication.create({
      data: { ...data, applicationNumber, status: VisaStatus.DRAFT },
      include: {
        client: { select: { id: true, firstName: true, lastName: true } },
        destinationCountry: { select: { id: true, name: true } },
      },
    });
  }

  async update(id: string, data: UpdateVisaApplicationDto): Promise<VisaApplication> {
    const app = await this.findById(id);
    if (!app) throw new NotFoundException('Visa application not found');
    return this.prisma.visaApplication.update({
      where: { id },
      data,
      include: { client: true, destinationCountry: true, documents: true },
    });
  }

  async updateStatus(id: string, status: VisaStatus, reviewNotes?: string, reviewedById?: string): Promise<VisaApplication> {
    const updateData: any = { status };
    if (reviewNotes) updateData.reviewNotes = reviewNotes;
    if (reviewedById) {
      updateData.reviewedById = reviewedById;
      updateData.reviewedAt = new Date();
    }
    return this.prisma.visaApplication.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: string): Promise<VisaApplication> {
    return this.prisma.visaApplication.delete({ where: { id } });
  }

  async getStatistics(): Promise<any> {
    const [total, byStatus, byCountry, recent] = await Promise.all([
      this.prisma.visaApplication.count(),
      this.prisma.visaApplication.groupBy({ by: ['status'], _count: { status: true } }),
      this.prisma.visaApplication.groupBy({ by: ['destinationCountryId'], _count: { destinationCountryId: true } }),
      this.prisma.visaApplication.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { client: { select: { firstName: true, lastName: true } }, destinationCountry: { select: { name: true } } },
      }),
    ]);

    return { total, byStatus, byCountry, recent };
  }
}
