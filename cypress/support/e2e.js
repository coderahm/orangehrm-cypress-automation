import './commands'

// Ignore random JS errors from the OrangeHRM public demo site
Cypress.on('uncaught:exception', (err) => {
  return false
})