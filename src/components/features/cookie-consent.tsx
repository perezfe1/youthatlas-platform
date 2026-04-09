'use client';

/**
 * Cookie Consent Banner + Google Analytics loader.
 *
 * Strategy:
 *  - Non-EU visitors  → GA loads immediately, no banner shown.
 *  - EU/EEA visitors  → GA is blocked until the user explicitly accepts.
 *                       A non-intrusive bottom bar asks once; choice is
 *                       persisted in localStorage (`gdpr-consent`).
 *
 * EU detection: middleware sets the `x-is-eu` cookie (httpOnly: false) based
 * on Vercel's `x-vercel-ip-country` header. Cookie lives for 24 hours.
 */

import { useEffect, useState } from 'react';

const GA_ID = 'G-481EY7ZP89';
const CONSENT_KEY = 'gdpr-consent';
const EU_COOKIE = 'x-is-eu';

type Consent = 'accepted' | 'declined' | null;

// Module-level guard — prevents double-injecting the GA script.
let gaLoaded = false;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '=([^;]*)'),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function injectGA() {
  if (gaLoaded || typeof window === 'undefined') return;
  gaLoaded = true;

  // Inline gtag bootstrap (mirrors the Next.js Script approach)
  (window as Window & { dataLayer?: unknown[] }).dataLayer =
    (window as Window & { dataLayer?: unknown[] }).dataLayer ?? [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function gtag(...args: any[]) {
    ((window as Window & { dataLayer?: unknown[] }).dataLayer as unknown[]).push(args);
  }
  (window as Window & { gtag?: unknown }).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.async = true;
  document.head.appendChild(script);
}

export function CookieConsent() {
  const [mounted, setMounted]   = useState(false);
  const [isEu, setIsEu]         = useState(false);
  const [consent, setConsent]   = useState<Consent>(null);

  useEffect(() => {
    const euFlag = readCookie(EU_COOKIE) === '1';
    setIsEu(euFlag);

    const stored = localStorage.getItem(CONSENT_KEY) as Consent | null;
    setConsent(stored);
    setMounted(true);

    // Load GA immediately if: non-EU user, or EU user who already accepted.
    if (!euFlag || stored === 'accepted') {
      injectGA();
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    setConsent('accepted');
    injectGA();
  }

  function decline() {
    localStorage.setItem(CONSENT_KEY, 'declined');
    setConsent('declined');
  }

  // Nothing to render until we know the user's context (avoids hydration flash).
  if (!mounted) return null;
  // Non-EU: GA already loaded above, no banner needed.
  if (!isEu) return null;
  // EU user who already made a choice: banner was shown before.
  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 sm:gap-8">
        <p className="text-sm text-text-secondary flex-1 leading-relaxed">
          We use optional analytics cookies to understand how visitors use YouthAtlas.
          The site works fully without them.{' '}
          <a href="/privacy" className="underline hover:text-text-primary transition-colors">
            Privacy policy
          </a>
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={decline}
            className="px-3 py-1.5 text-sm text-text-secondary border border-border rounded-md hover:bg-surface transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="px-3 py-1.5 text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
