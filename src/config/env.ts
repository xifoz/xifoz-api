import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  PORT: z.coerce.number().default(4000),

  DATABASE_URL: z.string().min(1),

  CORS_ORIGIN: z.string().min(1),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),

  RATE_LIMIT_MAX: z.coerce.number().default(100),

  JWT_ACCESS_SECRET: z.string().min(64),

  JWT_REFRESH_SECRET: z.string().min(64),

  ACCESS_TOKEN_EXPIRES: z.string(),

  REFRESH_TOKEN_EXPIRES: z.string(),

  BCRYPT_ROUNDS: z.coerce.number().min(10).max(15),

  COOKIE_SECURE: z.string().transform(v => v === 'true'),

  COOKIE_DOMAIN: z.string().optional(),

  ADMIN_EMAIL: z.string().email(),

  ADMIN_NAME: z.string().min(1),

  ADMIN_PASSWORD: z.string().min(12),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('\n❌ Invalid environment configuration\n');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
