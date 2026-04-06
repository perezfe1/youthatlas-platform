import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Contact | YouthAtlas',
  description:
    'Get in touch with the YouthAtlas team. General inquiries, error reports, partnership requests, and more.',
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">Contact Us</h1>
      <p className="mt-6 text-slate-600 leading-relaxed">
        Have a question, found an error, or want to collaborate? We&apos;d love to hear from you.
        YouthAtlas is a project of Prospera Development Foundation, a registered 501(c)(3) nonprofit
        (EIN: 92-3630661).
      </p>

      {/* ── General Inquiries ── */}
      <h2 className="font-display mt-10 mb-3 text-2xl font-semibold text-[#1A1A2E]">
        General Inquiries
      </h2>
      <p className="text-slate-600 leading-relaxed">
        For general questions, feedback, or just to say hello:
      </p>
      <div className="mt-4">
        <a
          href="mailto:hello@youthatlas.com"
          className="inline-block rounded-lg bg-blue-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-blue-600"
        >
          Email hello@youthatlas.com
        </a>
      </div>

      {/* ── Feature Your Opportunity ── */}
      <h2 className="font-display mt-10 mb-3 text-2xl font-semibold text-[#1A1A2E]">
        Feature Your Opportunity
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Are you an organization with an opportunity for young people? Get in front of thousands of
        motivated applicants.
      </p>
      <div className="mt-4">
        <Link
          href="/advertise"
          className="inline-block rounded-lg border-2 border-blue-500 px-6 py-3 font-semibold text-blue-500 transition-colors hover:bg-blue-50"
        >
          Learn More
        </Link>
      </div>

      {/* ── Report an Error ── */}
      <h2 className="font-display mt-10 mb-3 text-2xl font-semibold text-[#1A1A2E]">
        Report an Error
      </h2>
      <p className="text-slate-600 leading-relaxed">
        Spotted an outdated or incorrect listing? Email us at{' '}
        <a
          href="mailto:hello@youthatlas.com"
          className="text-blue-500 hover:text-blue-600 underline"
        >
          hello@youthatlas.com
        </a>{' '}
        and we&apos;ll fix it within 24 hours.
      </p>

      {/* ── Nonprofit Information ── */}
      <h2 className="font-display mt-10 mb-3 text-2xl font-semibold text-[#1A1A2E]">
        Nonprofit Information
      </h2>
      <p className="text-slate-600 leading-relaxed">
        YouthAtlas is operated by Prospera Development Foundation, a registered 501(c)(3) nonprofit
        organization. EIN: 92-3630661. For partnership or grant inquiries, contact{' '}
        <a
          href="mailto:hello@youthatlas.com"
          className="text-blue-500 hover:text-blue-600 underline"
        >
          hello@youthatlas.com
        </a>
        .
      </p>

      {/* ── Response time ── */}
      <div className="mt-10 rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <p className="text-center text-sm text-slate-500">
          We typically respond within 1&ndash;2 business days.
        </p>
      </div>
    </div>
  );
}
