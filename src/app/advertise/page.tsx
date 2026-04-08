import type { Metadata } from 'next';

import { AdvertiseForm } from '@/components/features/advertise-form';

export const revalidate = false; // fully static — no Supabase calls

export const metadata: Metadata = {
  title: 'Feature Your Opportunity | YouthAtlas',
  description:
    'Reach thousands of young people actively looking for scholarships, fellowships, internships and grants.',
};

export default function AdvertisePage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-bold text-[#1A1A2E] sm:text-4xl">
          Feature Your Opportunity
        </h1>
        <p className="mt-3 text-lg text-text-secondary">
          Reach thousands of young people actively looking for scholarships,
          fellowships, internships and grants.
        </p>
      </div>

      <div className="mt-10">
        <AdvertiseForm />
      </div>
    </div>
  );
}
