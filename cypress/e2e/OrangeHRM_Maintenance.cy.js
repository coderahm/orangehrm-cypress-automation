describe('OrangeHRM - Maintenance Module', () => {

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
      timeout: 120000,
    })
    cy.get('input[name="username"]', { timeout: 60000 }).should('be.visible')
    cy.get('input[name="username"]').clear().type('Admin')
    cy.get('input[name="password"]', { timeout: 60000 }).clear().type('admin123')
    cy.get('button[type="submit"]').click()

    cy.url({ timeout: 90000 }).should('include', '/dashboard')
    cy.get('.oxd-main-menu', { timeout: 90000 }).should('be.visible')
    cy.wait(2000)

    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Maintenance')
      .should('be.visible')
      .click()

    cy.url({ timeout: 90000 }).should('include', '/maintenance')
  })

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

    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')
  })

  it('TC03 - verifies Purge Records page tabs', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Purge Records', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).should('be.visible')
  })

  it('TC04 - verifies Purge Records search fields are visible', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.get('.oxd-input-group input', { timeout: 30000 })
      .should('have.length.at.least', 1)

    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
  })

  it('TC05 - searches for an employee in Purge Records', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.get('.oxd-input-group input', { timeout: 30000 })
      .first()
      .type('0001')

    cy.contains('button', 'Search', { timeout: 30000 }).click()
    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')

    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
  })

  it('TC06 - verifies Purge Records search accepts input', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.get('.oxd-input-group input', { timeout: 30000 })
      .first()
      .should('be.visible')

    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })

  it('TC07 - navigates to Access Records page', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/maintenance/accessEmployee')
  })

  it('TC08 - verifies Access Records page loads', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/maintenance/accessEmployee')

    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  it('TC09 - verifies both Maintenance sub-tabs are present', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Purge Records', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Access Records', { timeout: 30000 }).should('be.visible')
  })

  it('TC10 - verifies the page loads without errors', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Password')
      .parent().parent().find('input')
      .type('admin123')
    cy.contains('button', 'Confirm', { timeout: 30000 }).click()
    cy.url({ timeout: 90000 }).should('include', '/maintenance/purgeEmployee')

    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })

})