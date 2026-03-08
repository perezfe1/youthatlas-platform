import { type NextRequest, NextResponse } from 'next/server';

import { getAdvertiseEnv } from '@/config/env';
import { validateOrigin, corsHeaders, withCors } from '@/lib/api-security';
import { advertiseLimit, rateLimitHeaders } from '@/lib/rate-limiter';
import { advertiseSchema, validateBody } from '@/lib/validation';
import { submitFeaturedListing } from '@/services/featured-service';

// ── OPTIONS /api/advertise — CORS preflight ──────────────────────────────────

export function OPTIONS(request: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(request.headers.get('origin') ?? undefined),
  });
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── POST /api/advertise ──────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  // Origin validation
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Rate limit by IP
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = advertiseLimit.check(ip);
  const rlHeaders = rateLimitHeaders(rl);

  if (!rl.allowed) {
    return withCors(
      NextResponse.json(
        { error: 'Too many requests. Try again later.' },
        { status: 429, headers: rlHeaders },
      ),
      request,
    );
  }

  // Validate body
  const validation = await validateBody(request, advertiseSchema);
  if (validation.error) {
    return withCors(
      NextResponse.json(
        { error: validation.error.message },
        { status: 400, headers: rlHeaders },
      ),
      request,
    );
  }

  const data = validation.data;

  // Submit to database
  const result = await submitFeaturedListing(data);
  if (result.error) {
    console.error('[advertise] DB insert failed:', result.error.message);
    return withCors(
      NextResponse.json(
        { error: 'Submission failed. Please try again.' },
        { status: 500, headers: rlHeaders },
      ),
      request,
    );
  }

  // Send admin notifications (fire-and-forget — never block the response)
  sendAdminNotifications(data).catch((err) => {
    console.error('[advertise] Admin notification error:', err);
  });

  return withCors(
    NextResponse.json({ success: true }, { status: 201, headers: rlHeaders }),
    request,
  );
}

// ── Admin notifications ──────────────────────────────────────────────────────

async function sendAdminNotifications(data: {
  orgName: string;
  contactEmail: string;
  opportunityTitle: string;
  opportunityUrl: string;
  opportunityDescription?: string;
  message?: string;
}): Promise<void> {
  let env: ReturnType<typeof getAdvertiseEnv>;
  try {
    env = getAdvertiseEnv();
  } catch (err) {
    console.error('[advertise] Advertise env not configured:', err);
    return;
  }

  // ── Telegram notification ──────────────────────────────────────────────
  const telegramText = [
    '🏢 New featured listing submission!',
    '',
    `Org: ${data.orgName}`,
    `Email: ${data.contactEmail}`,
    `Title: ${data.opportunityTitle}`,
    `URL: ${data.opportunityUrl}`,
    '',
    'Review in Supabase dashboard → featured_listings table',
  ].join('\n');

  try {
    await fetch(
      `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHANNEL_ID,
          text: telegramText,
        }),
      },
    );
  } catch (err) {
    console.error('[advertise] Telegram notification failed:', err);
  }

  // ── Email notification via Resend ──────────────────────────────────────
  const emailHtml = `
    <h2>New Featured Listing Submission</h2>
    <p><strong>Organization:</strong> ${escapeHtml(data.orgName)}</p>
    <p><strong>Contact Email:</strong> ${escapeHtml(data.contactEmail)}</p>
    <p><strong>Opportunity Title:</strong> ${escapeHtml(data.opportunityTitle)}</p>
    <p><strong>Opportunity URL:</strong> <a href="${escapeHtml(data.opportunityUrl)}">${escapeHtml(data.opportunityUrl)}</a></p>
    ${data.opportunityDescription ? `<p><strong>Description:</strong> ${escapeHtml(data.opportunityDescription)}</p>` : ''}
    ${data.message ? `<p><strong>Message:</strong> ${escapeHtml(data.message)}</p>` : ''}
    <hr>
    <p>Review in the <a href="https://supabase.com/dashboard">Supabase dashboard</a> → featured_listings table</p>
  `;

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'YouthAtlas <reminders@youthatlas.com>',
        to: env.ADMIN_EMAIL,
        subject: `New featured listing submission: ${data.orgName}`,
        html: emailHtml,
      }),
    });
  } catch (err) {
    console.error('[advertise] Email notification failed:', err);
  }
}
