import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: '__tests__/e2e/**/*.spec.ts',
    supportFile: 'cypress/support/commands.ts',
    video: false,
    screenshotOnRunFailure: false,
  },
});
