// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
// const ENVIRONMENT = process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV;

const SENTRY_DSN = process.env.SENTRY_DSN;
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT;
const SENTRY_RELEASE = process.env.SENTRY_RELEASE;
const NODE_ENV = process.env.NODE_ENV;

Sentry.init({
  dsn:
    SENTRY_DSN ||
    'https://10f8d5ba589f0ed60270b0e4675551b0@o183917.ingest.us.sentry.io/4508841639936001',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  release: SENTRY_RELEASE,
  environment: SENTRY_ENVIRONMENT,
  enabled: NODE_ENV === 'production' || NODE_ENV === 'staging',
});
