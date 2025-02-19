import { defineConfig } from 'cypress';
import dotenvPlugin from 'cypress-dotenv';
import { sign } from 'jsonwebtoken';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        generateToken({ user, secret }) {
          return sign(user, secret);
        },
      });
      const updatedConfig = dotenvPlugin(config, {}, true);
      return updatedConfig;
    },

    baseUrl: 'http://localhost:3000',
    video: true,
    videoCompression: true,
  },
});
