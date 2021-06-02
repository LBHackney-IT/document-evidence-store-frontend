import fs from 'fs';

module.exports = {
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
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.PALO_ALTOS_SSL_CERTIFICATE': fs.readFileSync(
          '/opt/palo-alto-ssl-certificate.crt'
        ),
      })
    );

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
