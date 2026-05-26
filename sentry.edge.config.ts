import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.01, // 1% — was 10%, each trace = tunnel invocation + observability event
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
});
