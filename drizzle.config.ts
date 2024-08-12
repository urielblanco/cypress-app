import type { Config } from 'drizzle-kit';
import 'dotenv/config';

if (!process.env.DATABASE_URL) {
  console.log('🔴 Cannot find database url');
}

export default {
  schema: './src/lib/supabase/schema.ts',
  dialect: 'postgresql',
  out: './migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL || ''
  }
} satisfies Config;
