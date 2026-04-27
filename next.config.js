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
  // Trace production deps into build/_next/standalone so the Lambda zip stays under 250MB unzipped.
  output: 'standalone',
  // Reduce what gets traced into standalone (esp. dev-only trees if referenced accidentally).
  outputFileTracingExcludes: {
    '*': ['**/node_modules/cypress/**', '**/node_modules/@types/**'],
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /.*\.test\.ts$/ }),
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
};

const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin. Keep in mind that
  // the following options are set automatically, and overriding them is not
  // recommended:
  //   release, url, org, project, authToken, configFile, stripPrefix,
  //   urlPrefix, include, ignore

  silent: true, // Suppresses all logs
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options.
};

module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);
