import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { createServerSupabaseClient } from '@/lib/supabase/server';
import { LoginForm } from '@/components/features/login-form';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sign In — YouthAtlas',
};

type PageProps = {
  searchParams: Record<string, string | string[] | undefined>;
};

export default async function LoginPage({ searchParams }: PageProps) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect('/opportunities');
  }

  const redirectUrl =
    typeof searchParams.redirect === 'string' ? searchParams.redirect : undefined;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <LoginForm redirectUrl={redirectUrl} />
    </div>
  );
}
