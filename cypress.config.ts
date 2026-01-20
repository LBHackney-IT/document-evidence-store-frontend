import { defineConfig } from 'cypress';
import dotenvPlugin from 'cypress-dotenv';
import { existsSync, unlinkSync } from 'fs';
import { sign } from 'jsonwebtoken';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        generateToken({ user, secret }) {
          return sign(user, secret);
        },
      });
      on(
        'after:spec',
        // after the test has run, only save the video exists and if the test failed.
        // https://docs.cypress.io/api/node-events/after-spec-api
        (spec: Cypress.Spec, results: CypressCommandLine.RunResult) => {
          if (results && results.video && results.stats.failures === 0) {
            if (existsSync(results.video)) unlinkSync(results.video);
          }
        }
      );
      
      // Set default environment variables for Next.js server during tests
      // These are used as fallbacks when AWS SSM is not available
      if (!process.env.SUPER_USERS) {
        process.env.SUPER_USERS = 'test@hackney.gov.uk,test1@hackney.gov.uk,test2@hackney.gov.uk';
      }
      if (!process.env.IS_SUPER_USER_DELETE_ENABLED) {
        process.env.IS_SUPER_USER_DELETE_ENABLED = 'false';
      }
      
      const updatedConfig = dotenvPlugin(config, {}, true);
      return updatedConfig;
    },
    baseUrl: 'http://localhost:3000',
    video: true,
    videoCompression: true,
  },
});
