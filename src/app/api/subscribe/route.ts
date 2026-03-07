import { NextResponse } from 'next/server';

import { getKitEnv } from '@/config/env';

// ── Helpers ────────────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ── POST /api/subscribe ────────────────────────────────────────────────────────

export async function POST(request: Request) {
  // Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const email =
    body !== null && typeof body === 'object' && 'email' in body && typeof body.email === 'string'
      ? body.email.trim().toLowerCase()
      : '';

  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
  }

  // Load Kit env (throws if vars are missing — caught below)
  let kitEnv: ReturnType<typeof getKitEnv>;
  try {
    kitEnv = getKitEnv();
  } catch (err) {
    console.error('[subscribe] Kit env missing:', err);
    return NextResponse.json({ error: 'Newsletter service is not configured.' }, { status: 503 });
  }

  // Subscribe via Kit API v3
  const kitUrl = `https://api.convertkit.com/v3/forms/${kitEnv.KIT_FORM_ID}/subscribe`;

  let kitRes: Response;
  try {
    kitRes = await fetch(kitUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: kitEnv.KIT_API_KEY, email }),
    });
  } catch (err) {
    console.error('[subscribe] Kit API network error:', err);
    return NextResponse.json({ error: 'Could not reach newsletter service. Try again.' }, { status: 502 });
  }

  if (!kitRes.ok) {
    const text = await kitRes.text().catch(() => '');
    console.error('[subscribe] Kit API error:', kitRes.status, text);
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 502 });
  }

  return NextResponse.json({ success: true });
}
