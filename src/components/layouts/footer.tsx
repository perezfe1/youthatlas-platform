import Link from 'next/link';

import { EmailSignup } from '@/components/features/email-signup';

// ── Data ──────────────────────────────────────────────────────────────────────

const BROWSE_LINKS = [
  { label: 'Scholarships', href: '/opportunities?type=scholarship' },
  { label: 'Fellowships', href: '/opportunities?type=fellowship' },
  { label: 'Grants', href: '/opportunities?type=grant' },
  { label: 'Internships', href: '/opportunities?type=internship' },
  { label: 'Competitions', href: '/opportunities?type=competition' },
] as const;

const ABOUT_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
] as const;

const PARTNER_LINKS = [
  { label: 'Feature Your Opportunity', href: '/advertise' },
] as const;

// ── Sub-components ────────────────────────────────────────────────────────────

function FooterBrand() {
  return (
    <div>
      <span className="font-display text-lg font-bold text-white">
        Youth<span className="text-blue-400">Atlas</span>
      </span>
      <p className="mt-2 text-sm text-slate-400">
        Aggregating opportunities for young people globally.
      </p>
    </div>
  );
}

function FooterColumn({ title, links }: { title: string; links: ReadonlyArray<{ label: string; href: string }> }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-slate-400 transition-colors hover:text-white">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterNewsletter() {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">Weekly Newsletter</h3>
      <div className="mt-3">
        <EmailSignup variant="footer" />
      </div>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function Footer() {
  return (
    <footer className="mt-auto bg-[#1A1A2E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <FooterBrand />
          <FooterColumn title="Browse" links={BROWSE_LINKS} />
          <FooterColumn title="About" links={ABOUT_LINKS} />
          <FooterColumn title="Work With Us" links={PARTNER_LINKS} />
          <FooterNewsletter />
        </div>

        <div className="mt-10 border-t border-slate-700 pt-6">
          <p className="text-center text-sm text-slate-400">
            &copy; 2026 YouthAtlas. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
