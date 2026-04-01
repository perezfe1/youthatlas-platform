import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

import { getServerEnv } from '@/config/env';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;

  try {
    const { ADMIN_PASSWORD } = getServerEnv();
    if (!session || session !== ADMIN_PASSWORD) {
      redirect('/admin/login');
    }
  } catch {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
