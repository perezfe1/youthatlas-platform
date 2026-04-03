import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

function htmlPage(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${title} — YouthAtlas</title>
</head>
<body style="margin:0;padding:0;background-color:#FFFBF5;font-family:Inter,system-ui,-apple-system,sans-serif;">
  <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:32px 16px;">
    <div style="text-align:center;max-width:480px;">
      ${body}
    </div>
  </div>
</body>
</html>`;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (!token) {
    return new NextResponse(
      htmlPage('Invalid Link', `
        <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1A1A2E;">Invalid Link</h1>
        <p style="margin:0 0 24px;color:#6B7280;font-size:15px;">No unsubscribe token provided.</p>
        <a href="/opportunities" style="color:#2563EB;text-decoration:underline;font-size:14px;">Browse opportunities</a>
      `),
      { status: 400, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;

  if (!supabaseUrl || !serviceKey) {
    return new NextResponse(
      htmlPage('Error', `
        <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1A1A2E;">Something went wrong</h1>
        <p style="margin:0 0 24px;color:#6B7280;font-size:15px;">Please try again later.</p>
        <a href="/opportunities" style="color:#2563EB;text-decoration:underline;font-size:14px;">Browse opportunities</a>
      `),
      { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  const supabase = createClient(supabaseUrl, serviceKey);

  // Look up the token
  const { data, error: selectError } = await supabase
    .from('reminder_preferences')
    .select('id, reminders_enabled')
    .eq('unsubscribe_token', token)
    .limit(1)
    .maybeSingle();

  if (selectError || !data) {
    return new NextResponse(
      htmlPage('Invalid Link', `
        <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1A1A2E;">Invalid or expired link</h1>
        <p style="margin:0 0 24px;color:#6B7280;font-size:15px;">This unsubscribe link is not valid. It may have already been used or expired.</p>
        <a href="/opportunities" style="color:#2563EB;text-decoration:underline;font-size:14px;">Browse opportunities</a>
      `),
      { status: 404, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    );
  }

  // Update to disabled
  await supabase
    .from('reminder_preferences')
    .update({ reminders_enabled: false, unsubscribed_at: new Date().toISOString() })
    .eq('unsubscribe_token', token);

  return new NextResponse(
    htmlPage("You've been unsubscribed", `
      <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#1A1A2E;">You&#8217;ve been unsubscribed</h1>
      <p style="margin:0 0 24px;color:#6B7280;font-size:15px;">You won&#8217;t receive any more deadline reminders from YouthAtlas.</p>
      <a href="/opportunities" style="color:#2563EB;text-decoration:underline;font-size:14px;">Browse opportunities</a>
    `),
    { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
  );
}
