'use client';

import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type ShareButtonProps = {
  title: string;
  slug: string;
  /** 'default' = full-width with label, 'compact' = icon-only square button */
  variant?: 'default' | 'compact';
};

// ── Share icon (arrow-up-from-box) ────────────────────────────────────────────

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isMobileOrTablet(): boolean {
  if (typeof window === 'undefined') return false;
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

function fallbackCopyToClipboard(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.left = '-9999px';
  textarea.style.top = '-9999px';
  document.body.appendChild(textarea);
  textarea.focus();
  textarea.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }
  document.body.removeChild(textarea);
  return success;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ShareButton({ title, slug, variant = 'default' }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = `https://youthatlas.com/opportunities/${slug}`;

    // Use native share sheet only on mobile/tablet where it provides a good UX
    if (isMobileOrTablet() && typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    // Copy URL to clipboard
    let success = false;

    // Try modern Clipboard API first
    if (navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        success = true;
      } catch {
        // Permission denied or not focused, try fallback
      }
    }

    // Fallback: execCommand('copy') via hidden textarea
    if (!success) {
      success = fallbackCopyToClipboard(url);
    }

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (variant === 'compact') {
    return (
      <button
        onClick={handleShare}
        type="button"
        className={`flex shrink-0 items-center justify-center rounded-lg border p-3 transition-colors ${
          copied
            ? 'border-green-300 bg-green-50 text-green-700'
            : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
        }`}
        aria-label={copied ? 'Link copied!' : 'Share this opportunity'}
      >
        {copied ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <ShareIcon />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleShare}
      type="button"
      className={`mt-3 flex w-full items-center justify-center gap-2 rounded-lg border px-6 py-3 text-sm font-semibold transition-colors ${
        copied
          ? 'border-green-300 bg-green-50 text-green-700'
          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
      }`}
    >
      {copied ? (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      ) : (
        <ShareIcon />
      )}
      {copied ? 'Link copied!' : 'Share'}
    </button>
  );
}
