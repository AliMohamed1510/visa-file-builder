import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bull';
import { AuthModule } from '@auth/auth.module';
import { UsersModule } from '@users/users.module';
import { ClientsModule } from '@clients/clients.module';
import { CountriesModule } from '@countries/countries.module';
import { VisaApplicationsModule } from '@visa-applications/visa-applications.module';
import { DocumentsModule } from '@documents/documents.module';
import { OfficesModule } from '@offices/offices.module';
import { EmployeesModule } from '@employees/employees.module';
import { OcrModule } from '@ocr/ocr.module';
import { PdfModule } from '@pdf/pdf.module';
import { PrismaModule } from '@common/prisma.module';
import { LoggerModule } from '@common/logger.module';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import jwtConfig from '@config/jwt.config';
import redisConfig from '@config/redis.config';
import storageConfig from '@config/storage.config';
import ocrConfig from '@config/ocr.config';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        databaseConfig,
        jwtConfig,
        redisConfig,
        storageConfig,
        ocrConfig,
      ],
      envFilePath: ['.env', '../.env'],
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 10,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 50,
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100,
      },
    ]),

    // Queue System (Redis)
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // Core Modules
    PrismaModule,
    LoggerModule,

    // Feature Modules
    AuthModule,
    UsersModule,
    ClientsModule,
    CountriesModule,
    VisaApplicationsModule,
    DocumentsModule,
    OfficesModule,
    EmployeesModule,
    OcrModule,
    PdfModule,
  ],
})
export class AppModule {}
