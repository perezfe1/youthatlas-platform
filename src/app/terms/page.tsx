import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Terms of Service — YouthAtlas',
  description: 'Terms and conditions for using the YouthAtlas platform.',
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

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: March 2026</p>

      <p className="mt-6 text-slate-600 leading-relaxed">
        By using YouthAtlas, you agree to these terms. Please read them carefully. If you do not
        agree, please do not use the platform.
      </p>

      {/* ── What YouthAtlas Is ── */}
      <SectionHeading>What YouthAtlas Is</SectionHeading>
      <Body>
        <p>
          YouthAtlas is a free aggregator of scholarships, fellowships, grants, internships, and
          other opportunities for young people. We collect publicly available information from
          across the web and present it in a searchable, organized format.
        </p>
        <p>
          We are not affiliated with, endorsed by, or partnered with any of the organizations
          that offer these opportunities. We are simply a discovery tool that helps you find
          them in one place.
        </p>
      </Body>

      {/* ── Accuracy ── */}
      <SectionHeading>Accuracy of Information</SectionHeading>
      <Body>
        <p>
          We strive to present accurate, up-to-date information, but we cannot guarantee that
          all details are current or complete. Opportunity listings are collected automatically
          and may not immediately reflect changes made by the original provider.
        </p>
        <p>
          <strong className="text-slate-800">
            Always verify details on the original opportunity provider&apos;s website before
            applying.
          </strong>{' '}
          Deadlines, eligibility criteria, funding amounts, and application requirements may
          change without notice.
        </p>
        <p>
          YouthAtlas is not responsible for any consequences arising from reliance on
          information displayed on this platform.
        </p>
      </Body>

      {/* ── Your Account ── */}
      <SectionHeading>Your Account</SectionHeading>
      <Body>
        <p>If you create an account on YouthAtlas:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            You are responsible for keeping your login email secure and not sharing access to
            your account.
          </li>
          <li>One account per person. Duplicate accounts may be removed.</li>
          <li>
            We reserve the right to suspend or terminate accounts that abuse the platform,
            attempt unauthorized access, or violate these terms.
          </li>
        </ul>
      </Body>

      {/* ── Acceptable Use ── */}
      <SectionHeading>Acceptable Use</SectionHeading>
      <Body>
        <p>You may use YouthAtlas to:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>Browse, search, and save opportunities for personal use.</li>
          <li>Share links to individual opportunity listings.</li>
          <li>Subscribe to newsletters and updates.</li>
        </ul>
        <p>You may not:</p>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            Scrape, copy, or systematically download our aggregated opportunity data for
            redistribution or use in competing products.
          </li>
          <li>
            Attempt to disrupt, overload, or exploit any part of the platform or its
            infrastructure.
          </li>
          <li>
            Use the platform for any unlawful purpose or in a way that violates the rights of
            others.
          </li>
        </ul>
      </Body>

      {/* ── Limitation of Liability ── */}
      <SectionHeading>Limitation of Liability</SectionHeading>
      <Body>
        <p>
          YouthAtlas is provided &ldquo;as is&rdquo; without warranties of any kind, express or
          implied. We do not warrant that the platform will be uninterrupted, error-free, or
          free of viruses or other harmful components.
        </p>
        <p>
          We are not responsible for the outcome of any application you submit to an opportunity
          listed on YouthAtlas, nor for any loss or damage arising from the use of information
          on this platform.
        </p>
        <p>
          To the fullest extent permitted by law, YouthAtlas and its operators shall not be
          liable for any indirect, incidental, special, or consequential damages.
        </p>
      </Body>

      {/* ── Third-Party Links ── */}
      <SectionHeading>Third-Party Links</SectionHeading>
      <Body>
        <p>
          YouthAtlas links to external websites that are not operated by us. We have no control
          over their content, privacy practices, or availability. A link from YouthAtlas does
          not constitute an endorsement of that website or organization.
        </p>
      </Body>

      {/* ── Changes ── */}
      <SectionHeading>Changes to These Terms</SectionHeading>
      <Body>
        <p>
          We may update these terms from time to time. We will update the &ldquo;Last
          updated&rdquo; date at the top of this page when we do. Continued use of YouthAtlas
          after changes are posted constitutes your acceptance of the updated terms.
        </p>
        <p>
          Questions about these terms? Contact us at{' '}
          <a href="mailto:hello@youthatlas.com" className="text-blue-500 hover:text-blue-600 underline">
            hello@youthatlas.com
          </a>
          .
        </p>
      </Body>
    </div>
  );
}
