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
  { label: 'Contact', href: '/contact' },
  { label: 'News', href: '/news' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
] as const;

const PARTNER_LINKS = [
  { label: 'Feature Your Opportunity', href: '/advertise' },
] as const;

const DONATION_URL = 'https://www.zeffy.com/en-US/donation-form/help-young-people-find-life-changing-opportunities';

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
    <div className="min-w-0">
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
    <footer className="mt-auto overflow-hidden bg-[#1A1A2E] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-6">
          <FooterBrand />
          <FooterColumn title="Browse" links={BROWSE_LINKS} />
          <FooterColumn title="About" links={ABOUT_LINKS} />
          <FooterColumn title="Work With Us" links={PARTNER_LINKS} />
          <div>
            <h3 className="text-sm font-semibold text-white">Support Us</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href={DONATION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-400 transition-colors hover:text-amber-300"
                >
                  💛 Support Us
                </a>
              </li>
            </ul>
          </div>
          <FooterNewsletter />
        </div>

        <div className="mt-10 border-t border-slate-700 pt-6">
          <p className="text-center text-sm text-slate-400">
            &copy; 2026 YouthAtlas. All rights reserved.
          </p>
          <p className="mt-2 text-center text-xs text-slate-400">
            YouthAtlas is a project of Prospera Development Foundation, a registered 501(c)(3) nonprofit &middot; EIN: 92-3630661
          </p>
        </div>
      </div>
    </footer>
  );
}
