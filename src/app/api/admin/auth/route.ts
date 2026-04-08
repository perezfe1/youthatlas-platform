import { createHash } from 'crypto';
import { type NextRequest, NextResponse } from 'next/server';

import { getServerEnv } from '@/config/env';
import { authLimit, rateLimitHeaders } from '@/lib/rate-limiter';

/** Derive a session token from the admin password — never store the raw password in a cookie. */
function deriveSessionToken(password: string): string {
  return createHash('sha256').update(`admin-session-v1:${password}`).digest('hex');
}

export async function POST(request: NextRequest) {
  // Rate limit: 5 attempts per IP per 15 minutes
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = authLimit.check(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many attempts — try again later' },
      { status: 429, headers: rateLimitHeaders(rl) },
    );
  }

  let body: { password?: string };
  try {
    body = (await request.json()) as { password?: string };
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  let adminPassword: string;
  try {
    adminPassword = getServerEnv().ADMIN_PASSWORD;
  } catch {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (!body.password || body.password !== adminPassword) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  const sessionToken = deriveSessionToken(adminPassword);

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', sessionToken, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  });
  return response;
}
