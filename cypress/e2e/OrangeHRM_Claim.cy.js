describe('OrangeHRM - Claim Module', () => {

  beforeEach(() => {
    // 1. Login
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get('input[name="username"]', { timeout: 60000 }).should('be.visible')
    cy.get('input[name="username"]').clear().type('Admin')
    cy.get('input[name="password"]', { timeout: 60000 }).clear().type('admin123')
    cy.get('button[type="submit"]').click()

    // 2. Wait for dashboard
    cy.url({ timeout: 60000 }).should('include', '/dashboard')
    cy.get('.oxd-main-menu', { timeout: 60000 }).should('be.visible')
    cy.wait(2000)

    // 3. Navigate to Claim module via sidebar
    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Claim')
      .should('be.visible')
      .click()

    // 4. Confirm we're inside the Claim module
    cy.url({ timeout: 60000 }).should('include', '/claim')
  })

  // ================================
  // LANDING PAGE
  // ================================

  it('TC01 - displays Claim module landing page', () => {
    // The demo lands on Assign Claim by default
    cy.url({ timeout: 30000 }).should('include', '/claim/viewAssignClaim')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  it('TC02 - verifies the Claim module tabs are present', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Submit Claim', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Employee Claims', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Assign Claim', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // EMPLOYEE CLAIMS
  // ================================

  it('TC03 - navigates to Employee Claims page', () => {
    // Navigate directly by URL to avoid tab click issues
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewClaim')
    cy.url({ timeout: 60000 }).should('include', '/claim/viewClaim')

    // Verify form loads
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  it('TC04 - verifies Employee Claims search form is visible', () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewClaim')
    cy.url({ timeout: 60000 }).should('include', '/claim/viewClaim')

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')

    // Search input fields should be present
    cy.get('.oxd-input-group', { timeout: 30000 })
      .should('have.length.at.least', 1)

    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // SUBMIT CLAIM
  // ================================

  it('TC05 - navigates to Submit Claim page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Submit Claim', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/claim/submitClaim')
  })

  it('TC06 - verifies Submit Claim page has a form', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Submit Claim', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/claim/submitClaim')

    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.get('.oxd-input-group', { timeout: 30000 }).should('have.length.at.least', 1)
  })

  // ================================
  // ASSIGN CLAIM
  // ================================

  it('TC07 - navigates to Assign Claim page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Assign Claim', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/claim/assignClaim')
  })

  it('TC08 - verifies Assign Claim page has a form', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Assign Claim', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/claim/assignClaim')

    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.get('.oxd-input-group', { timeout: 30000 }).should('have.length.at.least', 1)
  })

  // ================================
  // NAVIGATION & HEALTH
  // ================================

  it('TC09 - can navigate between Claim pages via URL', () => {
    // Visit Submit Claim
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/claim/submitClaim')
    cy.url({ timeout: 60000 }).should('include', '/claim/submitClaim')

    // Visit Employee Claims
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewClaim')
    cy.url({ timeout: 60000 }).should('include', '/claim/viewClaim')

    // Visit Assign Claim
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/claim/viewAssignClaim')
    cy.url({ timeout: 60000 }).should('include', '/claim/viewAssignClaim')
  })

  it('TC10 - verifies the page loads without errors', () => {
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })

})