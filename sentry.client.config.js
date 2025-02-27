// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

// const ENVIRONMENT = process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV;

console.log('NEXT_PUBLIC_NODE_ENV client', process.env.NEXT_PUBLIC_NODE_ENV);
console.log(
  'NEXT_PUBLIC_SENTRY_RELEASE client',
  process.env.NEXT_PUBLIC_SENTRY_RELEASE
);
console.log(
  'NEXT_PUBLIC_SENTRY_ENVIRONMENT client',
  process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT
);

const ENVIRONMENT = process.env.NEXT_PUBLIC_ENV;

console.log('NEXT_PUBLIC_ENV client', ENVIRONMENT);

Sentry.init({
  dsn:
    'https://10f8d5ba589f0ed60270b0e4675551b0@o183917.ingest.us.sentry.io/4508841639936001',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  // release: SENTRY_RELEASE,
  // environment: SENTRY_ENVIRONMENT,
  // enabled: NODE_ENV === 'production',

  environment: ENVIRONMENT,
  integrations: [Sentry.captureConsoleIntegration()],
  enabled:
    ENVIRONMENT === 'production' ||
    ENVIRONMENT === 'staging' ||
    ENVIRONMENT === 'development',
});
