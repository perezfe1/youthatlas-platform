import { NextResponse, type NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

// ── API rate limiting (in-memory, resets on cold start) ───────────────────────
const apiRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkApiRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = apiRateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    apiRateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 30) return false;
  entry.count++;
  return true;
}

// ── EU/EEA country codes (GDPR applies) ──────────────────────────────────────
const EU_COUNTRY_CODES = new Set([
  // EU 27
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DE', 'DK', 'EE', 'ES',
  'FI', 'FR', 'GR', 'HU', 'IE', 'IT', 'LT', 'LU', 'LV', 'MT',
  'NL', 'PL', 'PT', 'RO', 'SE', 'SI', 'SK',
  // EEA (GDPR equivalent)
  'IS', 'LI', 'NO',
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.ip ??
      'unknown';
    if (!checkApiRateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  const response = await updateSession(request);

  // ── Set EU flag cookie (readable by client JS, 24h TTL) ──────────────────
  // Only set once — don't overwrite on every request if already present.
  if (!request.cookies.has('x-is-eu')) {
    const country = request.headers.get('x-vercel-ip-country') ?? '';
    const isEu = EU_COUNTRY_CODES.has(country.toUpperCase());
    response.cookies.set('x-is-eu', isEu ? '1' : '0', {
      httpOnly: false,   // must be JS-readable for the client banner
      sameSite: 'lax',
      maxAge: 86_400,    // 24 hours — re-check daily (travellers, VPNs)
      path: '/',
    });
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|txt|xml)$).*)',
  ],
};
