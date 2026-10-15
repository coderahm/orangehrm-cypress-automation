describe('OrangeHRM - PIM Module (Full)', () => {

  const timestamp = Date.now()
  const TAB = '.oxd-topbar-body-nav-tab-item'

  const newEmployee = {
    firstName: `Test${timestamp}`,
    lastName: 'Automation',
    employeeId: `E${timestamp.toString().slice(-8)}`,
  }

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
    cy.wait(3000)

    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('PIM')
      .should('be.visible')
      .click()

    cy.url({ timeout: 90000 }).should('include', '/pim/viewEmployeeList')
  })

  // ================================
  // EXISTING PIM TESTS
  // ================================

  it('TC01 - displays PIM employee list page', () => {
    cy.url({ timeout: 30000 }).should('include', '/pim/viewEmployeeList')
    cy.contains('h5', 'Employee Information', { timeout: 30000 }).should('be.visible')
  })

  it('TC02 - adds a new employee successfully', () => {
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/pim/addEmployee')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.wait(2000)

    cy.get('input[name="firstName"]', { timeout: 60000 }).should('be.visible').type(newEmployee.firstName)
    cy.get('input[name="lastName"]', { timeout: 60000 }).type(newEmployee.lastName)

    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Employee Id')
      .parent().parent().find('input')
      .clear().type(newEmployee.employeeId)

    cy.contains('button', 'Save', { timeout: 30000 }).click()

    cy.url({ timeout: 90000 }).should('include', '/pim/viewPersonalDetails')
  })

  it('TC03 - searches for an employee by name', () => {
    cy.get('input[placeholder="Type for hints..."]', { timeout: 30000 })
      .first().type(newEmployee.firstName)

    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option')
      .first().click({ force: true })

    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .should('have.length.at.least', 1)
    cy.get('.oxd-table-body').should('contain.text', newEmployee.firstName)
  })

  it('TC04 - searches for employee by ID', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Employee Id')
      .parent().parent().find('input').type(newEmployee.employeeId)

    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .should('have.length.at.least', 1)
  })

  it('TC05 - resets search filters', () => {
    const employeeIdInput = () =>
      cy.get('.oxd-input-group', { timeout: 30000 })
        .contains('Employee Id')
        .parent().parent().find('input')

    employeeIdInput().type('12345').should('have.value', '12345')
    cy.contains('button', 'Reset', { timeout: 30000 }).click()
    employeeIdInput().should('have.value', '')
  })

  // ================================
  // PIM - REPORTS (FIXED)
  // ================================

  it('TC06 - opens Reports page', () => {
    cy.contains(TAB, 'Reports', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/viewDefinedPredefinedReports')
  })

  it('TC07 - verifies Reports page loads', () => {
    cy.contains(TAB, 'Reports', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/viewDefinedPredefinedReports')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  it('TC08 - verifies Reports page has Add button', () => {
    cy.contains(TAB, 'Reports', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/viewDefinedPredefinedReports')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // PIM - CONFIGURATION
  // ================================

  it('TC09 - opens Configuration dropdown', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Custom Fields', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-dropdown-menu li', 'Data Import', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-dropdown-menu li', 'Reporting Methods', { timeout: 30000 }).should('be.visible')
  })

  it('TC10 - navigates to Custom Fields page', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Custom Fields', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/listCustomFields')
  })

  it('TC11 - verifies Custom Fields page has Add button', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Custom Fields', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/listCustomFields')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  it('TC12 - opens Add Custom Field form', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Custom Fields', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/saveCustomFields')
  })

  it('TC13 - verifies Add Custom Field form has required fields', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Custom Fields', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/saveCustomFields')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // PIM - OPTIONAL FIELDS (FIXED)
  // ================================

  it('TC14 - navigates to Optional Fields page', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Optional Fields', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/configurePim')
  })

  it('TC15 - verifies Optional Fields page loads', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Optional Fields', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/configurePim')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // PIM - DATA IMPORT (FIXED)
  // ================================

  it('TC16 - navigates to Data Import page', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Data Import', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/pimCsvImport')
  })

  it('TC17 - verifies Data Import page has file input', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Data Import', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/pimCsvImport')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.get('input[type="file"]', { timeout: 30000 }).should('exist')
  })

  // ================================
  // PIM - REPORTING METHODS & TERMINATION
  // ================================

  it('TC18 - navigates to Reporting Methods page', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Reporting Methods', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/viewReportingMethods')
  })

  it('TC19 - verifies Reporting Methods page has Add button', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Reporting Methods', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/viewReportingMethods')

    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  it('TC20 - navigates to Termination Reasons page', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Termination Reasons', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/pim/viewTerminationReasons')
  })

  // ================================
  // PIM - EMPLOYEE PROFILE
  // ================================

  it('TC21 - opens an employee profile', () => {
    cy.get('input[placeholder="Type for hints..."]', { timeout: 30000 })
      .first().type(newEmployee.firstName)

    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option')
      .first().click({ force: true })

    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first()
      .find('.bi-pencil-fill')
      .click({ force: true })

    cy.url({ timeout: 60000 }).should('include', '/pim/viewPersonalDetails')
  })

  it('TC22 - verifies employee profile has Contact Details tab', () => {
    cy.get('input[placeholder="Type for hints..."]', { timeout: 30000 })
      .first().type(newEmployee.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option')
      .first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first().find('.bi-pencil-fill').click({ force: true })

    cy.contains('.orangehrm-tabs-item', 'Contact Details', { timeout: 30000 }).should('be.visible')
  })

  it('TC23 - verifies employee profile has Job tab', () => {
    cy.get('input[placeholder="Type for hints..."]', { timeout: 30000 })
      .first().type(newEmployee.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option')
      .first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first().find('.bi-pencil-fill').click({ force: true })

    cy.contains('.orangehrm-tabs-item', 'Job', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // PIM - DELETE EMPLOYEE
  // ================================

  it('TC24 - deletes the newly created employee', () => {
    cy.get('input[placeholder="Type for hints..."]', { timeout: 30000 })
      .first().type(newEmployee.firstName)

    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option')
      .first().click({ force: true })

    cy.contains('button', 'Search', { timeout: 30000 }).click()
    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .should('have.length.at.least', 1)

    cy.get('.oxd-table-body .oxd-table-card')
      .first()
      .find('.bi-trash')
      .click({ force: true })

    cy.get('.oxd-dialog-container, .orangehrm-dialog-popup', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Yes, Delete', { timeout: 60000 }).click()
  })

  // ================================
  // PIM - HEALTH CHECK
  // ================================

  it('TC25 - verifies PIM page loads without errors', () => {
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })
  
})