const webpack = require('webpack');
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  async headers() {
    return [
      {
        source: '/:slug*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1',
          },
        ],
      },
    ];
  },
  distDir: 'build/_next',
  webpack: (config, { isServer, dev }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /.*\.test\.ts$/ })
    );
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }
    return config;
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/teams',
        permanent: true,
      },
    ];
  },
  experimental: {
    instrumentationHook: true,
  },
};

const NODE_ENV = process.env.NODE_ENV;
const SENTRY_RELEASE = process.env.SENTRY_RELEASE;

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore
  dryRun: !(NODE_ENV === 'production'),
  release: SENTRY_RELEASE,
  silent: !(NODE_ENV === 'production'),
  silent: true, // Suppresses all logs
  hideSourceMaps: true,
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
