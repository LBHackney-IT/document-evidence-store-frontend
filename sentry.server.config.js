// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs';

const ENVIRONMENT = process.env.APP_ENV || process.env.NEXT_PUBLIC_APP_ENV;

const SENTRY_RELEASE =
  process.env.SENTRY_RELEASE || process.env.NEXT_PUBLIC_SENTRY_RELEASE;

const NODE_ENV = process.env.NODE_ENV || process.env.NEXT_PUBLIC_NODE_ENV;

Sentry.init({
  dsn:
    'https://10f8d5ba589f0ed60270b0e4675551b0@o183917.ingest.us.sentry.io/4508841639936001',

  tracesSampleRate: 1.0,
  release: SENTRY_RELEASE,
  enabled: NODE_ENV === 'production',
  environment: ENVIRONMENT,
});
