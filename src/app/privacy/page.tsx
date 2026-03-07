import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Privacy Policy — YouthAtlas',
  description: 'How YouthAtlas collects, uses, and protects your personal information.',
};

// ── Shared prose helpers ───────────────────────────────────────────────────────

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display mt-8 mb-3 text-2xl font-semibold text-[#1A1A2E]">
      {children}
    </h2>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <div className="space-y-4 text-slate-600 leading-relaxed">{children}</div>;
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: March 2026</p>

      <p className="mt-6 text-slate-600 leading-relaxed">
        YouthAtlas is committed to protecting your privacy. This policy explains what data we
        collect, how we use it, and your rights regarding that data.
      </p>

      {/* ── What We Collect ── */}
      <SectionHeading>What We Collect</SectionHeading>
      <Body>
        <p>We collect only what we need to operate the platform:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-800">Email address</strong> — when you sign up for
            our newsletter or create an account.
          </li>
          <li>
            <strong className="text-slate-800">Saved opportunity preferences</strong> — if you
            create an account, we store which opportunities you&apos;ve bookmarked.
          </li>
          <li>
            <strong className="text-slate-800">Basic usage analytics</strong> — aggregate page
            view counts to understand which content is useful. No personal tracking or
            fingerprinting.
          </li>
        </ul>
        <p>We do not collect payment information, government IDs, or sensitive personal data.</p>
      </Body>

      {/* ── How We Use Your Data ── */}
      <SectionHeading>How We Use Your Data</SectionHeading>
      <Body>
        <ul className="list-disc pl-5 space-y-2">
          <li>To send weekly opportunity digests to newsletter subscribers.</li>
          <li>To save and display your bookmarked opportunities when you log in.</li>
          <li>To understand how people use YouthAtlas and improve the experience.</li>
        </ul>
        <p>
          <strong className="text-slate-800">We never sell your data to third parties.</strong>{' '}
          We do not use your data for advertising, profiling, or any purpose beyond operating
          this platform.
        </p>
      </Body>

      {/* ── Third-Party Services ── */}
      <SectionHeading>Third-Party Services</SectionHeading>
      <Body>
        <p>We use the following third-party services to operate YouthAtlas:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-800">Supabase</strong> — our database and
            authentication provider. Stores account data (email, saved opportunities) in secure
            cloud infrastructure.
          </li>
          <li>
            <strong className="text-slate-800">Kit (ConvertKit)</strong> — email marketing
            platform. Stores your email address if you subscribe to our newsletter.
          </li>
          <li>
            <strong className="text-slate-800">Vercel</strong> — our hosting provider. Standard
            web server access logs (IP, request path, timestamp) are retained per their privacy
            policy.
          </li>
          <li>
            <strong className="text-slate-800">Telegram</strong> — our public channel
            (@youthatlas1) is public and shares no personal subscriber data.
          </li>
        </ul>
        <p>
          Each of these services has its own privacy policy. We choose providers that meet high
          security and data protection standards.
        </p>
      </Body>

      {/* ── Your Rights ── */}
      <SectionHeading>Your Rights</SectionHeading>
      <Body>
        <p>You have the following rights regarding your data:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-800">Unsubscribe from emails</strong> — every
            newsletter email includes an unsubscribe link. Clicking it removes you from all
            future digests immediately.
          </li>
          <li>
            <strong className="text-slate-800">Delete your account</strong> — contact us at{' '}
            <a href="mailto:privacy@youthatlas.com" className="text-blue-500 hover:text-blue-600 underline">
              privacy@youthatlas.com
            </a>{' '}
            and we will delete your account and all associated data within 7 days.
          </li>
          <li>
            <strong className="text-slate-800">Request a copy of your data</strong> — email us
            and we&apos;ll provide a summary of the data we hold about you.
          </li>
        </ul>
      </Body>

      {/* ── Cookies ── */}
      <SectionHeading>Cookies</SectionHeading>
      <Body>
        <p>
          We use essential cookies for authentication only — specifically, to keep you logged
          in to your account across sessions. These cookies are set by Supabase and are
          necessary for the platform to function.
        </p>
        <p>
          We do not use advertising cookies, tracking pixels, or any third-party analytics
          cookies. You can disable cookies in your browser, but doing so will prevent you from
          staying logged in.
        </p>
      </Body>

      {/* ── Contact ── */}
      <SectionHeading>Contact</SectionHeading>
      <Body>
        <p>
          For privacy-related questions, data requests, or account deletion, contact us at:{' '}
          <a href="mailto:privacy@youthatlas.com" className="text-blue-500 hover:text-blue-600 underline">
            privacy@youthatlas.com
          </a>
        </p>
      </Body>

      {/* ── Changes ── */}
      <SectionHeading>Changes to This Policy</SectionHeading>
      <Body>
        <p>
          We may update this privacy policy from time to time. When we do, we will update the
          &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review
          this page periodically. Continued use of YouthAtlas after changes are posted
          constitutes your acceptance of the updated policy.
        </p>
      </Body>
    </div>
  );
}
