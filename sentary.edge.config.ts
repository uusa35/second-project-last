import * as Sentry from '@sentry/nextjs';
import { isLocal } from './src/constants';
Sentry.init({
  dsn: isLocal
    ? process.env.NEXT_PUBLIC_SENTRY_DEV
    : process.env.NEXT_PUBLIC_SENTRY_DEV,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
});
