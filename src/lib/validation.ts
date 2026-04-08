/**
 * Shared Zod schemas and a typed request-body validation helper.
 *
 * All schemas are exported so they can be reused in tests or other contexts.
 * The `validateBody` helper follows the `Result<T>` pattern: it never throws.
 */

import { z, type ZodSchema } from 'zod';
import { type NextRequest } from 'next/server';

import type { AppError, Region, OpportunityType } from '@/types/opportunity';
import { REGIONS, OPPORTUNITY_TYPES } from '@/types/opportunity';

// Re-export so callers don't need to import from two places
export type ValidationResult<T> =
  | { data: T; error: null }
  | { data: null; error: AppError };

// ── Schemas ───────────────────────────────────────────────────────────────────

export const subscribeSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .max(254, 'Email address is too long')
    .trim()
    .toLowerCase()
    .email('Invalid email address'),
});

export const profileUpdateSchema = z.object({
  display_name: z
    .string()
    .max(100, 'Display name must be 100 characters or fewer')
    .trim()
    .nullable()
    .optional(),
  regions_of_interest: z
    .array(z.enum(REGIONS as unknown as [Region, ...Region[]]))
    .optional(),
  types_of_interest: z
    .array(
      z.enum(
        OPPORTUNITY_TYPES as unknown as [OpportunityType, ...OpportunityType[]],
      ),
    )
    .optional(),
});

export const advertiseSchema = z.object({
  orgName: z
    .string({ required_error: 'Organization name is required' })
    .min(2, 'Organization name must be at least 2 characters')
    .max(200, 'Organization name must be 200 characters or fewer')
    .trim(),
  contactEmail: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address')
    .trim()
    .toLowerCase(),
  opportunityTitle: z
    .string({ required_error: 'Opportunity title is required' })
    .min(2, 'Title must be at least 2 characters')
    .max(300, 'Title must be 300 characters or fewer')
    .trim(),
  opportunityUrl: z
    .string({ required_error: 'Opportunity URL is required' })
    .url('Invalid URL')
    .trim(),
  opportunityDescription: z
    .string()
    .max(1000, 'Description must be 1000 characters or fewer')
    .trim()
    .optional(),
  message: z
    .string()
    .max(500, 'Message must be 500 characters or fewer')
    .trim()
    .optional(),
});

/** auth/profile only checks auth — no body fields to validate */
export const authProfileSchema = z.object({}).strict();

export const digestPreferencesSchema = z.object({
  digest_frequency: z.enum(['weekly', 'biweekly']).optional(),
  digest_keywords: z
    .array(z.string().min(1).max(30).trim())
    .max(10, 'Maximum 10 keywords')
    .optional(),
  types_of_interest: z
    .array(z.enum(OPPORTUNITY_TYPES as unknown as [OpportunityType, ...OpportunityType[]]))
    .optional(),
  regions_of_interest: z
    .array(z.enum(REGIONS as unknown as [Region, ...Region[]]))
    .optional(),
  country_of_citizenship: z
    .string()
    .trim()
    .toLowerCase()
    .max(100)
    .nullable()
    .optional(),
});

// ── Inferred types ────────────────────────────────────────────────────────────

export type SubscribeInput = z.infer<typeof subscribeSchema>;
export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type AdvertiseInput = z.infer<typeof advertiseSchema>;

// ── Helper ────────────────────────────────────────────────────────────────────

/**
 * Parse and validate a Next.js request body against `schema`.
 *
 * Returns `{ data, error: null }` on success or `{ data: null, error }` on
 * parse/validation failure — never throws.
 */
export async function validateBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<ValidationResult<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      data: null,
      error: {
        code: 'PARSE_ERROR',
        message: 'Request body must be valid JSON',
      },
    };
  }

  const result = schema.safeParse(raw);
  if (!result.success) {
    const message = result.error.issues.map((i) => i.message).join('; ');
    return {
      data: null,
      error: { code: 'VALIDATION_ERROR', message },
    };
  }

  return { data: result.data, error: null };
}
