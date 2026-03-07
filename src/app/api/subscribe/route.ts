import { type NextRequest, NextResponse } from 'next/server';

import { getKitEnv } from '@/config/env';

// ── Rate limiting ──────────────────────────────────────────────────────────────
// Simple in-memory Map: resets on each deploy, which is acceptable.

const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (rateLimitMap.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS,
  );
  if (timestamps.length >= RATE_LIMIT_MAX) return true;
  timestamps.push(now);
  rateLimitMap.set(ip, timestamps);
  return false;
}

// ── Helpers ────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── POST /api/subscribe ────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Try again later.' },
      { status: 429 },
    );
  }

  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  const email =
    body !== null &&
    typeof body === 'object' &&
    'email' in body &&
    typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  // Load Kit env
  let kitEnv: ReturnType<typeof getKitEnv>;
  try {
    kitEnv = getKitEnv();
  } catch (err) {
    console.error('[subscribe] Kit env missing:', err);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }

  // Call Kit API v3 — add subscriber to account
  try {
    const res = await fetch('https://api.convertkit.com/v3/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_secret: kitEnv.KIT_API_SECRET, email_address: email }),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => '');
      console.error('[subscribe] Kit API error:', res.status, text);
      return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
    }
  } catch (err) {
    console.error('[subscribe] Kit API network error:', err);
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
