describe('OrangeHRM - Maintenance Module', () => {

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

    // 3. Navigate to Maintenance module
    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Maintenance')
      .should('be.visible')
      .click()

    // 4. Maintenance requires admin password re-entry
    cy.url({ timeout: 60000 }).should('include', '/maintenance')
  })

  // ================================
  // AUTHENTICATION GATE
  // ================================

  it('TC01 - displays Maintenance password confirmation page', () => {
    cy.contains('h6', 'Administrator Access', { timeout: 30000 }).should('be.visible')
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .should('be.visible')
    cy.contains('button', 'Confirm', { timeout: 30000 }).should('be.visible')
  })

  it('TC02 - confirms the admin password successfully', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')

    cy.contains('button', 'Confirm', { timeout: 30000 }).click()

    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')
  })

  // ================================
  // PURGE RECORDS
  // ================================

  it('TC03 - verifies Purge Records page tabs', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Purge Records', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).should('be.visible')
  })

    it('TC04 - verifies Purge Records search fields are visible', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    // Verify at least one input field is present
    cy.get('.oxd-input-group input', { timeout: 30000 })
      .should('have.length.at.least', 1)

    // Maintenance has a Search button but NO Reset button
    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
  })

  it('TC05 - searches for an employee in Purge Records', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    // Type into the first visible input field
    cy.get('.oxd-input-group input', { timeout: 30000 })
      .first()
      .type('0001')

    cy.contains('button', 'Search', { timeout: 30000 }).click()
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')

    // Confirm the search button is still present (page didn't crash)
    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
  })

  it('TC06 - verifies Purge Records search accepts input', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    cy.get('.oxd-input-group input', { timeout: 30000 })
      .first()
      .should('be.visible')

    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })

  // ================================
  // ACCESS RECORDS
  // ================================

  it('TC07 - navigates to Access Records page', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/maintenance/accessEmployee')
  })

  it('TC08 - verifies Access Records page loads', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/maintenance/accessEmployee')

    // Verify the page loaded
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // MODULE NAVIGATION
  // ================================

  it('TC09 - verifies both Maintenance sub-tabs are present', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Purge Records', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).should('be.visible')
  })

  it('TC10 - verifies the page loads without errors', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/maintenance/purgeEmployee')

    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })

})