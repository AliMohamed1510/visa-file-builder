import { ParseUUIDPipe, ValidationPipe } from '@nestjs/common';

export const ParseUUID = () => new ParseUUIDPipe({ version: '4' });

export const ParsePagination = () =>
  new ValidationPipe({
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });
