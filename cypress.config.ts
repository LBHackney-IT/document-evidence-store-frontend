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
      const updatedConfig = dotenvPlugin(config, {}, true);
      return updatedConfig;
    },
    baseUrl: 'http://localhost:3000',
    video: true,
    videoCompression: true,
  },
});
