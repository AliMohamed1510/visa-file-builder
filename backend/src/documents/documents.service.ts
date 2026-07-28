import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '@common/prisma.service';
import { Document, DocumentType, DocumentStatus, Prisma } from '@prisma/client';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { generateFileName } from '@common/utils/file.util';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class DocumentsService {
  private readonly uploadDir: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.uploadDir = this.configService.get<string>('storage.uploadDir', './uploads');
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    where?: Prisma.DocumentWhereInput;
  }): Promise<Document[]> {
    return this.prisma.document.findMany({
      ...params,
      include: { client: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(where?: Prisma.DocumentWhereInput): Promise<number> {
    return this.prisma.document.count({ where });
  }

  async findById(id: string): Promise<Document | null> {
    return this.prisma.document.findUnique({
      where: { id },
      include: { client: true, visaApplication: true },
    });
  }

  async uploadFile(
    file: Express.Multer.File,
    data: {
      clientId: string;
      type: DocumentType;
      visaApplicationId?: string;
    },
  ): Promise<Document> {
    const fileName = generateFileName(file.originalname);
    const typeDir = data.type.toLowerCase();
    const uploadPath = path.join(this.uploadDir, 'documents', typeDir);

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    const filePath = path.join(uploadPath, fileName);
    fs.writeFileSync(filePath, file.buffer);

    return this.prisma.document.create({
      data: {
        fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: `/uploads/documents/${typeDir}/${fileName}`,
        type: data.type,
        status: DocumentStatus.PENDING,
        clientId: data.clientId,
        visaApplicationId: data.visaApplicationId,
      },
    });
  }

  async update(id: string, data: UpdateDocumentDto): Promise<Document> {
    const doc = await this.findById(id);
    if (!doc) throw new NotFoundException('Document not found');
    return this.prisma.document.update({ where: { id }, data });
  }

  async updateOcrData(id: string, ocrData: any, confidence: number): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data: {
        ocrData,
        ocrConfidence: confidence,
        ocrProcessedAt: new Date(),
      },
    });
  }

  async verifyDocument(id: string, status: DocumentStatus, notes?: string, verifiedById?: string): Promise<Document> {
    return this.prisma.document.update({
      where: { id },
      data: {
        status,
        verificationNotes: notes,
        verifiedById,
        verifiedAt: new Date(),
      },
    });
  }

  async remove(id: string): Promise<Document> {
    const doc = await this.findById(id);
    if (!doc) throw new NotFoundException('Document not found');

    const fullPath = path.join(process.cwd(), doc.path);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    return this.prisma.document.delete({ where: { id } });
  }
}
