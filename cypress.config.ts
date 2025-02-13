import { defineConfig } from 'cypress';
import dotenvPlugin from 'cypress-dotenv';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      const updatedConfig = dotenvPlugin(config, {}, true);
      return updatedConfig;
    },
    baseUrl: 'http://localhost:3000',
    video: true,
    videoCompression: true,
  },
});
