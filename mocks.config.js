// For a detailed explanation regarding each configuration property, visit:
// https://www.mocks-server.org/docs/configuration/how-to-change-settings
// https://www.mocks-server.org/docs/configuration/options

module.exports = {
  // Log level. Can be one of silly, debug, verbose, info, warn or error
  log: 'debug',
  // Array of VariantHandlers to be added. Legacy
  //routesHandlers: [],
  config: {
    // Allow unknown arguments
    //allowUnknownArguments: false,
  },
  plugins: {
    // Plugins to be registered
    //register: [],
    proxyRoutesHandler: {},
    adminApi: {
      // Port number for the admin API server to be listening at
      //port: 3110,
      // Host for the admin API server
      //host: "0.0.0.0",
      // Legacy root path for admin routes
      //path: "/admin",
      https: {
        // Use https protocol or not
        //enabled: false,
        // Path to a TLS/SSL certificate
        //cert: undefined,
        // Path to the certificate private key
        //key: undefined,
      },
    },
    inquirerCli: {
      // Start interactive CLI or not
      enabled: false,
      // Render emojis or not
      //emojis: true,
    },
    openapi: {
      collection: {
        // Name for the collection created from OpenAPI definitions
        //id: "openapi",
        // Name of the collection to extend from
        //from: undefined,
      },
    },
  },
  mock: {
    routes: {
      // Global delay to apply to routes
      //delay: 0,
    },
    collections: {
      // Selected collection
      selected: 'standard',
    },
  },
  server: {
    // Port number for the server to be listening at
    port: 5000,
    // Host for the server
    //host: "0.0.0.0",
    cors: {
      // Use CORS middleware or not
      // enabled: true,
      // Options for the CORS middleware. Further information at https://github.com/expressjs/cors#configuration-options
      //options: {"preflightContinue":false},
    },
    jsonBodyParser: {
      // Use json body-parser middleware or not
      // enabled: true,
      // Options for the json body-parser middleware. Further information at https://github.com/expressjs/body-parser
      //options: {},
    },
    urlEncodedBodyParser: {
      // Use urlencoded body-parser middleware or not
      //enabled: true,
      // Options for the urlencoded body-parser middleware. Further information at https://github.com/expressjs/body-parser
      //options: {"extended":true},
    },
    https: {
      // Use https protocol or not
      //enabled: false,
      // Path to a TLS/SSL certificate
      //cert: undefined,
      // Path to the certificate private key
      //key: undefined,
    },
  },
  files: {
    // Allows to disable files load
    //enabled: true,
    // Define folder from where to load collections and routes
    path: 'test/mocks',
    // Enable/disable files watcher
    //watch: true,
    babelRegister: {
      // Load @babel/register
      //enabled: false,
      // Options for @babel/register
      //options: {},
    },
  },
  // mocks: {
  // },
  variantHandlers: {
    // Variant Handlers to be registered
    //register: [],
  },
};
