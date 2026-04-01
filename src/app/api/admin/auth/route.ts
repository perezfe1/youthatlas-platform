import { type NextRequest, NextResponse } from 'next/server';

import { getServerEnv } from '@/config/env';

export async function POST(request: NextRequest) {
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

  const response = NextResponse.json({ success: true });
  response.cookies.set('admin_session', adminPassword, {
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 86400,
    path: '/',
  });
  return response;
}
