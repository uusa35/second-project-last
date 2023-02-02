import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: 'https://26325383873847f0aa8f6b6fb837eace@o461386.ingest.sentry.io/4504610850537472',

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});
