import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'About — YouthAtlas',
  description:
    'Learn about YouthAtlas — a free platform that aggregates scholarships, fellowships, internships, grants, and more for young people worldwide.',
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

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">About YouthAtlas</h1>
      <p className="mt-6 text-slate-600 leading-relaxed">
        YouthAtlas is a free platform that aggregates scholarships, fellowships, internships, grants,
        competitions, and other opportunities for young people — all in one searchable, organized place.
      </p>

      {/* ── The Problem ── */}
      <SectionHeading>The Problem</SectionHeading>
      <Body>
        <p>
          Thousands of high-quality opportunities exist for young people every year — fully-funded
          fellowships, prestigious scholarships, competitive internships, and more. But they&apos;re
          scattered across hundreds of websites, social media groups, and mailing lists.
        </p>
        <p>
          Most students and young professionals never hear about the best opportunities simply because
          they don&apos;t know where to look — or don&apos;t have time to search every source every week.
        </p>
      </Body>

      {/* ── Our Solution ── */}
      <SectionHeading>Our Solution</SectionHeading>
      <Body>
        <p>
          YouthAtlas automatically discovers and indexes opportunities from across the web, presenting
          them in a clean, searchable format. Filter by type, region, funding status, or deadline.
          Bookmark the ones you care about. Get the best ones delivered to your inbox weekly.
        </p>
        <p>
          Everything on YouthAtlas is free. No paywalls, no premium tiers, no sponsored listings.
        </p>
      </Body>

      {/* ── How It Works ── */}
      <SectionHeading>How It Works</SectionHeading>
      <Body>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-800">AI-powered scrapers</strong> run daily to discover
            new opportunities from trusted sources across the web.
          </li>
          <li>
            <strong className="text-slate-800">Daily updates</strong> keep listings fresh — expired
            opportunities are automatically removed, and new ones surface quickly.
          </li>
          <li>
            <strong className="text-slate-800">Browse and filter</strong> by opportunity type,
            region, funding status, and deadline directly on the platform.
          </li>
          <li>
            <strong className="text-slate-800">Telegram channel</strong> (
            <a
              href="https://t.me/youthatlas1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              @youthatlas1
            </a>
            ) posts the best new opportunities daily.
          </li>
          <li>
            <strong className="text-slate-800">Weekly email digest</strong> delivers the top
            opportunities of the week straight to your inbox every Monday.
          </li>
        </ul>
      </Body>

      {/* ── Who We Are ── */}
      <SectionHeading>Who We Are</SectionHeading>
      <Body>
        <p>
          YouthAtlas is an independent project built and maintained by a small team passionate about
          making opportunity access more equitable. We are not affiliated with any university,
          government body, or funding organization.
        </p>
        <p>
          We believe that where you grow up or who you know shouldn&apos;t determine which
          opportunities you find out about. YouthAtlas exists to level that playing field.
        </p>
      </Body>

      {/* ── Get Involved ── */}
      <SectionHeading>Get Involved</SectionHeading>
      <Body>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-800">Join our Telegram channel</strong> —{' '}
            <a
              href="https://t.me/youthatlas1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              @youthatlas1
            </a>{' '}
            for daily opportunity updates.
          </li>
          <li>
            <strong className="text-slate-800">Subscribe to our newsletter</strong> — get the
            weekly digest delivered every Monday.{' '}
            <a href="/#newsletter" className="text-blue-500 hover:text-blue-600 underline">
              Sign up on the homepage.
            </a>
          </li>
          <li>
            <strong className="text-slate-800">Share with a friend</strong> — if YouthAtlas has
            helped you find an opportunity, pass it on.
          </li>
          <li>
            <strong className="text-slate-800">Get in touch</strong> — have a suggestion, found an
            error, or want to collaborate? Email us at{' '}
            <a
              href="mailto:hello@youthatlas.com"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              hello@youthatlas.com
            </a>
            .
          </li>
        </ul>
      </Body>
    </div>
  );
}
