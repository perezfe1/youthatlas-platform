import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { subscribeLimit, rateLimitHeaders } from '@/lib/rate-limiter';

const subscriptionSchema = z.object({
  endpoint: z.string().url().max(2048),
  keys: z.object({
    p256dh: z.string().min(1).max(256),
    auth:   z.string().min(1).max(64),
  }),
});

export async function POST(request: NextRequest) {
  // Rate limit per IP: 10 subscribe attempts per hour
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const rl = subscribeLimit.check(ip);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: 'Too many requests' },
      { status: 429, headers: rateLimitHeaders(rl) },
    );
  }

  try {
    const body = await request.json();
    const parsed = subscriptionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid subscription data' }, { status: 400 });
    }

    const { endpoint, keys } = parsed.data;

    // Resolve the authenticated user (if any) server-side — never trust client-provided userId
    const authClient = await createServerSupabaseClient();
    const { data: { user } } = await authClient.auth.getUser();
    const userId = user?.id ?? null;

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    const { error } = await supabase
      .from('push_subscriptions')
      .upsert(
        {
          endpoint,
          p256dh: keys.p256dh,
          auth: keys.auth,
          user_id: userId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'endpoint' },
      );

    if (error) {
      console.error('Failed to save push subscription:', error.message);
      return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE: unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint || typeof endpoint !== 'string' || endpoint.length > 2048) {
      return NextResponse.json({ error: 'Missing or invalid endpoint' }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );

    await supabase.from('push_subscriptions').delete().eq('endpoint', endpoint);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
