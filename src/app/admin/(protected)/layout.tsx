import { createHash } from 'crypto';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { getServerEnv } from '@/config/env';

function deriveSessionToken(password: string): string {
  return createHash('sha256').update(`admin-session-v1:${password}`).digest('hex');
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  try {
    const { ADMIN_PASSWORD } = getServerEnv();
    if (!session || session !== deriveSessionToken(ADMIN_PASSWORD)) {
      redirect('/admin/login');
    }
  } catch {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
