import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 5432,
  username: process.env.DB_USER || 'visa_admin',
  password: process.env.DB_PASSWORD || 'visa_secure_2024',
  database: process.env.DB_NAME || 'visa_file_builder',
  ssl: process.env.DB_SSL === 'true',
  poolSize: parseInt(process.env.DB_POOL_SIZE, 10) || 10,
}));
