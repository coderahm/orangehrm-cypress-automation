const { defineConfig } = require("cypress");
const cypressSplit = require("cypress-split"); // ADD THIS LINE

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    defaultCommandTimeout: 20000,
    pageLoadTimeout: 120000,
    viewportWidth: 1280,
    viewportHeight: 800,
    setupNodeEvents(on, config) {
      cypressSplit(on, config); // ADD THIS LINE
      return config; // ADD THIS LINE
    },
  },
});