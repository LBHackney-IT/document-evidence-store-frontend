module.exports = {
  distDir: 'build/_next',
  target: 'server',
  webpack: (config, { isServer }) => {
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
