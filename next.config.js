const nextEnv = require('next-env');

const config = {
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
};

const withNextEnv = nextEnv({
  publicPrefix: 'RUNTIME_',
});

module.exports = withNextEnv(config);
