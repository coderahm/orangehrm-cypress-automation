const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 120000,
    retries: {
      runMode: 2,   // Retries failed tests 2 times in GitHub Actions
      openMode: 0
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});