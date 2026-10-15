describe('OrangeHRM - Performance Module', () => {

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

    // 3. Navigate to Performance module
    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Performance')
      .should('be.visible')
      .click()

    // 4. Confirm we're inside the Performance module
    cy.url({ timeout: 60000 }).should('include', '/performance')
  })

  // ================================
  // LANDING PAGE
  // ================================

  it('TC01 - displays Performance module landing page', () => {
    cy.url({ timeout: 30000 }).should('include', '/performance')
  })

  it('TC02 - verifies the Performance module tabs are present', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Configure', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Manage Reviews', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'My Trackers', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Employee Trackers', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // CONFIGURE
  // ================================

  it('TC03 - opens Configure dropdown', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Configure', { timeout: 30000 }).click()

    // Dropdown should show KPIs, Trackers, Review Criteria
    cy.contains('.oxd-dropdown-menu li', 'KPIs', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-dropdown-menu li', 'Trackers', { timeout: 30000 }).should('be.visible')
  })

  it('TC04 - navigates to Configure > KPIs', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Configure', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'KPIs', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/performance/searchKpi')
  })

  it('TC05 - verifies KPIs page has search form', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Configure', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'KPIs', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/performance/searchKpi')

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
  })

  it('TC06 - navigates to Configure > Trackers', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Configure', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Trackers', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/performance/viewPerformanceTracker')
  })

  // ================================
  // MANAGE REVIEWS
  // ================================

   it('TC07 - navigates to Manage Reviews page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Manage Reviews', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Manage Reviews', { timeout: 30000 }).click()

    // Assert we're on a page under /performance/ that isn't the landing page
    cy.url({ timeout: 30000 }).should('include', '/performance/search')
  })

  it('TC08 - verifies Manage Reviews page has search form', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Manage Reviews', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Manage Reviews', { timeout: 30000 }).click()

    cy.url({ timeout: 30000 }).should('include', '/performance/search')

    // The form and search button should both be visible
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // MY TRACKERS
  // ================================

  it('TC09 - navigates to My Trackers page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'My Trackers', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/performance/viewMyPerformanceTrackerList')
  })

  it('TC10 - navigates to Employee Trackers page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Employee Trackers', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/performance/viewEmployeePerformanceTrackerList')
  })

})