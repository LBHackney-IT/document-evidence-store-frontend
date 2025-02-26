const server = require('restana')();
const app = require('next')({ dev: false });
const files = require('serve-static');
const path = require('path');
const nextRequestHandler = app.getRequestHandler();

console.log('Environment Variables:');
console.log('APP_ENV:', process.env.APP_ENV);
console.log('NEXT_PUBLIC_APP_ENV:', process.env.NEXT_PUBLIC_APP_ENV);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('NEXT_PUBLIC_NODE_ENV:', process.env.NEXT_PUBLIC_NODE_ENV);

server.use(files(path.join(__dirname, 'build')));
server.use(files(path.join(__dirname, 'public')));

// api routes, auth is handled by the authorizer
server.all('/api/*', (req, res) => nextRequestHandler(req, res));

server.all('*', (req, res) => nextRequestHandler(req, res));

module.exports.handler = require('serverless-http')(server);
