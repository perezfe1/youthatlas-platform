import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://fd73becc561a9b2fb96143404ee8f7ac@o4511156296744960.ingest.us.sentry.io/4511156301201408',
  tracesSampleRate: 0.1,
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
});
