import { NextResponse, type NextRequest } from 'next/server';

import { updateSession } from '@/lib/supabase/middleware';

// ── Bot blocking ─────────────────────────────────────────────────────────────
// Block aggressive crawlers + AI training scrapers. These consume serverless
// compute and return zero user/SEO value. Whitelist legitimate search bots only.
const BAD_BOT_PATTERN = new RegExp(
  [
    // AI training scrapers (HIGH PRIORITY - these can consume huge bandwidth)
    'GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'anthropic-ai',
    'Google-Extended', 'Applebot-Extended', 'CCBot', 'PerplexityBot',
    'ImagesiftBot', 'omgili', 'Bytespider', 'YouBot', 'DuckAssistBot',
    'Diffbot', 'FacebookBot', 'Meta-ExternalAgent', 'cohere-ai', 'cohere-training-data-crawler',
    'Amazonbot', 'Applebot',
    // Aggressive SEO/marketing crawlers (zero value, high cost)
    'AhrefsBot', 'SemrushBot', 'DotBot', 'MJ12bot', 'DataForSeoBot',
    'serpstatbot', 'BLEXBot', 'PetalBot', 'YandexBot', 'SeznamBot',
    'BaiduSpider', '360Spider', 'sogou', 'Sogou', 'NetcraftSurveyAgent',
    'SiteAuditBot', 'AwarioBot', 'BacklinksExtendedBot', 'BLEXBot',
    'DnyzBot', 'magpie-crawler', 'panscient', 'Buck',
    // Generic scrapers
    'python-requests', 'Scrapy', 'curl/', 'wget/', 'Go-http-client',
    'node-fetch', 'axios/', 'okhttp/', 'libwww-perl',
    'HttpClient', 'Java/', 'Apache-HttpClient',
  ].join('|'),
  'i',
);

// ── Rate limiting (in-memory, resets on cold start) ───────────────────────────
// Tighter limits since we're under bot pressure.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const API_RATE_LIMIT = 10;        // requests per minute per IP (was 30)
const PAGE_RATE_LIMIT = 60;       // requests per minute per IP for page views

function checkRateLimit(ip: string, limit: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= limit) return false;
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

// Paths that require Supabase auth session refresh.
const AUTH_PATHS = ['/dashboard', '/profile', '/api/', '/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ua = request.headers.get('user-agent') ?? '';

  // ── Bot blocking ──────────────────────────────────────────────────────────
  // Block known bad bots and AI scrapers before anything expensive runs.
  if (BAD_BOT_PATTERN.test(ua)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Block empty user agents (likely scripts/scrapers)
  if (!ua || ua.length < 10) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  // ── Get client IP for rate limiting ───────────────────────────────────────
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.ip ??
    'unknown';

  // ── API rate limiting (tight: 10/min) ─────────────────────────────────────
  if (pathname.startsWith('/api/') && !pathname.startsWith('/api/admin')) {
    if (!checkRateLimit(`api:${ip}`, API_RATE_LIMIT)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }
  }

  // ── Page rate limiting (60/min) — catches scrapers hitting many URLs ──────
  // Skip static assets via matcher config below.
  if (!pathname.startsWith('/api/') && !pathname.startsWith('/_next/')) {
    if (!checkRateLimit(`page:${ip}`, PAGE_RATE_LIMIT)) {
      return new NextResponse('Too many requests', { status: 429 });
    }
  }

  // ── Auth session refresh (only for auth-gated paths) ─────────────────────
  const needsAuth = AUTH_PATHS.some((p) => pathname.startsWith(p));
  const response = needsAuth
    ? await updateSession(request)
    : NextResponse.next();

  // ── Set EU flag cookie (readable by client JS, 24h TTL) ──────────────────
  if (!request.cookies.has('x-is-eu')) {
    const country = request.headers.get('x-vercel-ip-country') ?? '';
    const isEu = EU_COUNTRY_CODES.has(country.toUpperCase());
    response.cookies.set('x-is-eu', isEu ? '1' : '0', {
      httpOnly: false,
      sameSite: 'lax',
      maxAge: 86_400,
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
