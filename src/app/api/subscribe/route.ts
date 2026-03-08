import { type NextRequest, NextResponse } from 'next/server';

import { getKitEnv } from '@/config/env';
import { validateOrigin, corsHeaders, withCors } from '@/lib/api-security';
import {
  subscribeLimit,
  rateLimitHeaders,
} from '@/lib/rate-limiter';
import { subscribeSchema, validateBody } from '@/lib/validation';

// ── OPTIONS /api/subscribe — CORS preflight ────────────────────────────────────

export function OPTIONS(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin') ?? undefined),
  });
}

// ── POST /api/subscribe ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Origin validation
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = subscribeLimit.check(ip);
  const rlHeaders = rateLimitHeaders(rl);

  if (!rl.allowed) {
    return withCors(
      NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        {
          status: 429,
          headers: rlHeaders,
        },
      ),
      request,
    );
  }

  // Validate body
  const validation = await validateBody(request, subscribeSchema);
  if (validation.error) {
    return withCors(
      NextResponse.json(
        { error: validation.error.message },
        { status: 400, headers: rlHeaders },
      ),
      request,
    );
  }

  const { email } = validation.data;

  // Load Kit env
  let kitEnv: ReturnType<typeof getKitEnv>;
  try {
    kitEnv = getKitEnv();
  } catch (err) {
    console.error('[subscribe] Kit env missing:', err);
    return withCors(
      NextResponse.json(
        { error: 'Subscription failed. Please try again.' },
        { status: 500, headers: rlHeaders },
      ),
      request,
    );
  }

  // Call Kit API v3 — add subscriber to account
  try {
    const res = await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_secret: kitEnv.KIT_API_SECRET,
        email_address: email,
      }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[subscribe] Kit API error:', res.status, text);
      return withCors(
        NextResponse.json(
          { error: 'Subscription failed. Please try again.' },
          { status: 500, headers: rlHeaders },
        ),
        request,
      );
    }
  } catch (err) {
    console.error('[subscribe] Kit API network error:', err);
    return withCors(
      NextResponse.json(
        { error: 'Subscription failed. Please try again.' },
        { status: 500, headers: rlHeaders },
      ),
      request,
    );
  }

  return withCors(
    NextResponse.json({ success: true }, { headers: rlHeaders }),
    request,
  );
}
