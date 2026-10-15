describe('OrangeHRM - My Info Module', () => {

  beforeEach(() => {
    // 1. Login
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get('input[name="username"]', { timeout: 60000 }).should('be.visible')
    cy.get('input[name="username"]').clear().type('Admin')
    cy.get('input[name="password"]').clear().type('admin123')
    cy.get('button[type="submit"]').click()

    // 2. Wait for dashboard
    cy.url({ timeout: 60000 }).should('include', '/dashboard')
    cy.get('.oxd-main-menu', { timeout: 60000 }).should('be.visible')
    cy.wait(2000)

    // 3. Navigate to My Info module
    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('My Info')
      .should('be.visible')
      .click()

    // 4. My Info lands on Personal Details
    cy.url({ timeout: 60000 }).should('include', '/pim/viewPersonalDetails')
  })

  // ================================
  // LANDING PAGE & TABS
  // ================================

  it('TC01 - displays My Info module landing page', () => {
    cy.contains('h6', 'Personal Details', { timeout: 30000 }).should('be.visible')
  })

  it('TC02 - verifies all tabs are present', () => {
    const tabs = [
      'Personal Details',
      'Contact Details',
      'Emergency Contacts',
      'Dependents',
      'Immigration',
      'Job',
      'Salary',
      'Report-to',
      'Qualifications',
      'Memberships',
    ]
    tabs.forEach((tab) => {
      cy.contains('.orangehrm-tabs-item', tab, { timeout: 30000 }).should('be.visible')
    })
  })

  // ================================
  // PERSONAL DETAILS
  // ================================

  it('TC03 - verifies Personal Details fields are visible', () => {
    cy.contains('h6', 'Personal Details', { timeout: 30000 }).should('be.visible')
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Employee Full Name')
      .should('be.visible')
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Employee Id')
      .should('be.visible')
  })

  // ================================
  // CONTACT DETAILS
  // ================================

  it('TC04 - navigates to Contact Details tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Contact Details', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/contactDetails')
    cy.contains('h6', 'Contact Details', { timeout: 30000 }).should('be.visible')
  })

  it('TC05 - verifies Contact Details fields are visible', () => {
    cy.contains('.orangehrm-tabs-item', 'Contact Details', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/contactDetails')
    cy.contains('h6', 'Contact Details', { timeout: 30000 }).should('be.visible')
    // Verify at least one address field is visible
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Street 1')
      .should('be.visible')
  })

  // ================================
  // EMERGENCY CONTACTS
  // ================================

  it('TC06 - navigates to Emergency Contacts tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Emergency Contacts', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewEmergencyContacts')
    cy.contains('h6', 'Assigned Emergency Contacts', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // DEPENDENTS
  // ================================

  it('TC07 - navigates to Dependents tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Dependents', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewDependents')
    cy.contains('h6', 'Assigned Dependents', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // IMMIGRATION
  // ================================

  it('TC08 - navigates to Immigration tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Immigration', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewImmigration')
    cy.contains('h6', 'Assigned Immigration Records', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // JOB
  // ================================

  it('TC09 - navigates to Job tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Job', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewJobDetails')
    cy.contains('h6', 'Job Details', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // SALARY
  // ================================

  it('TC10 - navigates to Salary tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Salary', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewSalaryList')
    cy.contains('h6', 'Assigned Salary Components', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // REPORT-TO
  // ================================

    it('TC11 - navigates to Report-to tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Report-to', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewReportToDetails')

    // The page uses section headings instead of a single title
    cy.contains('h6', 'Assigned Supervisors', { timeout: 30000 }).should('be.visible')
    cy.contains('h6', 'Assigned Subordinates', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // QUALIFICATIONS
  // ================================

  it('TC12 - navigates to Qualifications tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Qualifications', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewQualifications')
    cy.contains('h6', 'Qualifications', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // MEMBERSHIPS
  // ================================

  it('TC13 - navigates to Memberships tab', () => {
    cy.contains('.orangehrm-tabs-item', 'Memberships', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewMemberships')
    cy.contains('h6', 'Assigned Memberships', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // NAVIGATION BACK
  // ================================

  it('TC14 - can navigate back to Personal Details from another tab', () => {
    // Go to a different tab first
    cy.contains('.orangehrm-tabs-item', 'Contact Details', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/contactDetails')

    // Now navigate back
    cy.contains('.orangehrm-tabs-item', 'Personal Details', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/viewPersonalDetails')
    cy.contains('h6', 'Personal Details', { timeout: 30000 }).should('be.visible')
  })

  it('TC15 - verifies the page loads without errors', () => {
    // Confirm the personal details form is present and no error text
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })

})