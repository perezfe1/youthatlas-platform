import { z } from 'zod';

// In production the Sentry DSN is required; in dev/test it is optional so
// engineers can run locally without setting it up.
const sentryDsnField =
  process.env.NODE_ENV === 'production'
    ? z.string().url('NEXT_PUBLIC_SENTRY_DSN must be a valid URL in production')
    : z.string().url().optional();

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: sentryDsnField,
});

const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_KEY: z.string().min(1),
  OPENAI_API_KEY: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(6),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

function validateClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  });
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Client environment validation failed:\n${missing}`);
  }
  return result.data;
}

function validateServerEnv(): ServerEnv {
  const result = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
    SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  });
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Server environment validation failed:\n${missing}`);
  }
  return result.data;
}

// Client env is safe to use anywhere (browser + server)
export const clientEnv = validateClientEnv();

// Server env must only be imported in server-side code
// Calling this in a client component will throw
export function getServerEnv(): ServerEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getServerEnv() called in browser — this is a server-only function');
  }
  return validateServerEnv();
}

// ── Advertise env (Telegram + Resend + admin email) ──────────────────────────

const advertiseEnvSchema = z.object({
  ADMIN_EMAIL: z.string().email(),
  RESEND_API_KEY: z.string().min(1),
  TELEGRAM_BOT_TOKEN: z.string().min(1),
  TELEGRAM_CHANNEL_ID: z.string().min(1),
});

export type AdvertiseEnv = z.infer<typeof advertiseEnvSchema>;

export function getAdvertiseEnv(): AdvertiseEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getAdvertiseEnv() called in browser — this is a server-only function');
  }
  const result = advertiseEnvSchema.safeParse({
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_CHANNEL_ID: process.env.TELEGRAM_CHANNEL_ID,
  });
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Advertise environment validation failed:\n${missing}`);
  }
  return result.data;
}

// ── Kit (ConvertKit) env ───────────────────────────────────────────────────────

const kitEnvSchema = z.object({
  KIT_API_SECRET: z.string().min(1),
});

export type KitEnv = z.infer<typeof kitEnvSchema>;

export function getKitEnv(): KitEnv {
  if (typeof window !== 'undefined') {
    throw new Error('getKitEnv() called in browser — this is a server-only function');
  }
  const result = kitEnvSchema.safeParse({
    KIT_API_SECRET: process.env.KIT_API_SECRET,
  });
  if (!result.success) {
    const missing = result.error.issues
      .map((i) => `  ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`Kit environment validation failed:\n${missing}`);
  }
  return result.data;
}
