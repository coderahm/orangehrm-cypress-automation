// ==========================================
// Custom Command: Login to OrangeHRM
// ==========================================
Cypress.Commands.add('loginOrangeHRM', (username = 'Admin', password = 'admin123') => {
  cy.visit('/web/index.php/auth/login')
  cy.get('input[name="username"]', { timeout: 30000 })
    .should('be.visible')
    .type(username)
  cy.get('input[name="password"]')
    .type(password)
  cy.get('button[type="submit"]')
    .click()
  cy.url({ timeout: 30000 }).should('include', '/dashboard')
})