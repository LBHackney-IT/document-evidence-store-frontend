module.exports = {
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
  target: 'server',
  webpack: (config, { webpack, isServer }) => {
    config.plugins.push(new webpack.IgnorePlugin(/.*\.test\.ts$/));
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
        fs: 'empty',
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
