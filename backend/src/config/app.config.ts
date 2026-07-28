import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  name: process.env.APP_NAME || 'Visa File Builder API',
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3001,
  url: process.env.APP_URL || 'http://localhost:3001',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  timezone: process.env.TZ || 'UTC',
  defaultLanguage: process.env.DEFAULT_LANGUAGE || 'ar',
  supportedLanguages: (process.env.SUPPORTED_LANGUAGES || 'ar,en').split(','),
}));
