const { defineConfig } = require('cypress');
const fse = require('fs-extra');

module.exports = defineConfig({
  defaultCommandTimeout: 70000,
  responseTimeout: 90000,
  requestTimeout: 90000,
  viewportWidth: 1090,
  viewportHeight: 1020,
  videoUploadOnPasses: false,
  reporter: 'mochawesome',
  reporterOptions: {
    reportDir: 'cypress/results',
    overwrite: false,
    html: false,
    json: true,
  },

  e2e: {
    setupNodeEvents(on, config) {
      // ideal for logging through terminal, esp on pipeline
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
      });

      const projectEnv = config.env.envForTests || 'test';

      return fse.readJSON(`cypress/config/${projectEnv}-env.json`);
    },
  },
});
