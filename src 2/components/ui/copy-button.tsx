'use client';

import { useState } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

type CopyButtonProps = {
  text: string;
};

// ── Component ─────────────────────────────────────────────────────────────────

export function CopyButton({ text }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard API may be unavailable in some contexts — fail silently
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-sm font-medium text-primary transition-colors hover:text-primary-dark"
      type="button"
    >
      {copied ? '✓ Copied!' : 'Copy Link'}
    </button>
  );
}
