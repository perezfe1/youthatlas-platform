'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

// This catches unhandled errors that bubble up through the entire App Router tree.
// It must be a Client Component and must render its own <html>/<body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          padding: 0,
          backgroundColor: '#FFFBF5',
          fontFamily: 'Inter, system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '0 16px' }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1A1A2E', margin: '0 0 12px' }}>
            Something went wrong
          </h1>
          <p style={{ color: '#6B7280', fontSize: 15, margin: '0 0 24px' }}>
            We&apos;ve been notified and are looking into it.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '8px 20px',
              backgroundColor: '#2563EB',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              fontSize: 14,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
