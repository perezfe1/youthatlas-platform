import { type NextRequest, NextResponse } from 'next/server';

// ── Allowed origins ────────────────────────────────────────────────────────────

export const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'https://youthatlas.vercel.app',
  'https://youthatlas.com',
  'https://www.youthatlas.com',
] as const;

type AllowedOrigin = (typeof ALLOWED_ORIGINS)[number];

function isAllowedOrigin(value: string): value is AllowedOrigin {
  return (ALLOWED_ORIGINS as readonly string[]).includes(value);
}

// ── Origin validation ──────────────────────────────────────────────────────────

/**
 * Validates the Origin (or Referer) header against the allowed domains list.
 * Always returns true in development so local testing is unaffected.
 *
 * Returns false only when an Origin header is present and explicitly not in the
 * allow-list — requests with no Origin at all (e.g. server-to-server calls) are
 * allowed through.
 */
export function validateOrigin(request: NextRequest): boolean {
  if (process.env.NODE_ENV === 'development') return true;

  const origin = request.headers.get('origin');

  // If an Origin header is present, it must be in the allow-list.
  if (origin !== null) {
    return isAllowedOrigin(origin);
  }

  // No Origin — fall back to Referer.
  const referer = request.headers.get('referer');
  if (referer) {
    return ALLOWED_ORIGINS.some((allowed) => referer.startsWith(allowed));
  }

  // No Origin or Referer — allow (server-to-server, curl, etc.).
  return true;
}

// ── CORS headers ───────────────────────────────────────────────────────────────

/**
 * Returns CORS response headers.
 * Reflects the request origin back only if it is in the allow-list;
 * otherwise falls back to the primary production domain.
 */
export function corsHeaders(origin?: string): Record<string, string> {
  const allowedOrigin =
    origin !== undefined && isAllowedOrigin(origin)
      ? origin
      : 'https://youthatlas.vercel.app';

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

// ── Convenience wrapper ────────────────────────────────────────────────────────

/**
 * Adds CORS headers to an existing NextResponse and returns it.
 */
export function withCors(response: NextResponse, request: NextRequest): NextResponse {
  const origin = request.headers.get('origin') ?? undefined;
  const headers = corsHeaders(origin);
  for (const [key, value] of Object.entries(headers)) {
    response.headers.set(key, value);
  }
  return response;
}
