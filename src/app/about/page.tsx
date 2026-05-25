import type { Metadata } from 'next';

export const dynamic = 'force-static';


export const metadata: Metadata = {
  title: 'About | YouthAtlas',
  description:
    'Learn about YouthAtlas, a project of Prospera Development Foundation (501(c)(3)), aggregating scholarships, fellowships, internships, and more for young people worldwide.',
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

// ── Impact Stats ─────────────────────────────────────────────────────────────

function ImpactStats() {
  const stats = [
    { value: '800+', label: 'Opportunities indexed' },
    { value: 'Daily', label: 'New opportunities added' },
    { value: 'Free', label: 'Always, for every user' },
  ];

  return (
    <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-slate-100 bg-white p-6 text-center shadow-sm"
        >
          <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
          <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-[#1A1A2E]">About YouthAtlas</h1>
      <p className="mt-6 text-slate-600 leading-relaxed">
        Prospera Development Foundation is a registered 501(c)(3) nonprofit organization
        (EIN: 92-3630661) that believes every young person deserves equal access to life-changing
        opportunities &mdash; regardless of where they were born or who they know. YouthAtlas is our
        flagship program: a free platform that aggregates scholarships, fellowships, internships,
        grants, competitions, and other opportunities for young people, all in one searchable,
        organized place. We index 800+ opportunities from trusted sources around the world, updated
        every single day.
      </p>

      {/* ── The Problem ── */}
      <SectionHeading>The Problem</SectionHeading>
      <Body>
        <p>
          Thousands of high-quality opportunities exist for young people every year. Fully-funded
          fellowships, prestigious scholarships, competitive internships, and more. But they&apos;re
          scattered across hundreds of websites, social media groups, and mailing lists.
        </p>
        <p>
          Most students and young professionals never hear about the best opportunities simply because
          they don&apos;t know where to look, or don&apos;t have the time to search every source every week.
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
            <strong className="text-slate-800">Daily updates</strong> keep listings fresh. Expired
            opportunities are automatically removed, and new ones surface quickly.
          </li>
          <li>
            <strong className="text-slate-800">Browse and filter</strong> by opportunity type,
            region, funding status, and deadline directly on the platform.
          </li>
          <li>
            <strong className="text-slate-800">Semantic search</strong> understands what you mean,
            not just what you type. Search &ldquo;climate funding&rdquo; and find environment,
            sustainability, and conservation opportunities too.
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
          YouthAtlas is a project of the Prospera Development Foundation, the nonprofit arm of
          Selvitas. Built by Federico Perez, a graduate student and developer focused on making
          opportunity access more equitable.
        </p>
        <p>
          We are not affiliated with any university, government body, or funding organization. We
          believe that where you grow up or who you know should not determine which opportunities you
          find out about. YouthAtlas exists to level that playing field.
        </p>
      </Body>

      {/* ── Our Impact ── */}
      <SectionHeading>Our Impact</SectionHeading>
      <ImpactStats />

      {/* ── Get Involved ── */}
      <SectionHeading>Get Involved</SectionHeading>
      <Body>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong className="text-slate-800">Share with a friend:</strong> if YouthAtlas has
            helped you find an opportunity, pass it on. That is the most powerful thing you can do.
          </li>
          <li>
            <strong className="text-slate-800">Follow our Telegram channel:</strong> join 1,000+
            young people getting daily opportunity alerts at{' '}
            <a
              href="https://t.me/youthatlas1"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              t.me/youthatlas1
            </a>
            .
          </li>
          <li>
            <strong className="text-slate-800">Get in touch:</strong> have a suggestion, found an
            error, or want to collaborate? Email us at{' '}
            <a
              href="mailto:hello@youthatlas.com"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              hello@youthatlas.com
            </a>
            .
          </li>
          <li>
            <strong className="text-slate-800">Feature your opportunity:</strong> are you an
            organization with an opportunity for young people? Get in front of thousands of motivated
            applicants.{' '}
            <a href="/advertise" className="text-blue-500 hover:text-blue-600 underline">
              Learn more at youthatlas.com/advertise.
            </a>
          </li>
        </ul>
      </Body>

      {/* ── Support Us ── */}
      <SectionHeading>Support Us</SectionHeading>
      <Body>
        <p>
          Building and maintaining YouthAtlas takes real resources. If this platform has ever helped
          you or someone you know, consider making a contribution. Every dollar keeps it free for the
          next person.
        </p>
        <p>
          Donations are processed securely through Zeffy, our trusted nonprofit donation partner.
          Prospera Development Foundation is a registered 501(c)(3) &mdash; your donation may be
          tax-deductible.
        </p>
      </Body>
      <div className="mt-6">
        <a
          href="https://www.zeffy.com/en-US/donation-form/help-young-people-find-life-changing-opportunities"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-amber-400 hover:bg-amber-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          Support YouthAtlas
        </a>
      </div>
    </div>
  );
}
