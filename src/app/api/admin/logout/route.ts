import { type NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/admin/login', request.url));
  response.cookies.delete('admin_session');
  return response;
}
