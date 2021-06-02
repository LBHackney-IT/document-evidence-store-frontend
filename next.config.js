const fs = require('fs');

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
    // Configures environment variable for Palo Altos SSL certificate
    // This should only be set when running the app in staging or production
    let app_env = process.env.APP_ENV;
    if (app_env === 'staging' || app_env === 'production') {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.PALO_ALTOS_SSL_CERTIFICATE': fs.readFileSync(
            '/opt/palo-alto-ssl-certificate.crt'
          ),
        })
      );
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
