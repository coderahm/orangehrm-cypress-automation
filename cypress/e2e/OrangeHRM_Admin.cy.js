describe('OrangeHRM - Admin Module (Full)', () => {

  const timestamp = Date.now()
  const TAB = '.oxd-topbar-body-nav-tab-item'
  
  // Data for new tests
  const newUsername = `QA_User_${timestamp}`
  const newLocation = {
    name: `Test Office ${timestamp}`,
    city: 'Karachi',
    country: 'Pakistan',
  }

  // ==========================================
  // SPEED UPGRADE: Login once using cy.session
  // ==========================================
  beforeEach(() => {
    cy.session('adminSession', () => {
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', {
        timeout: 120000,
      })
      cy.get('input[name="username"]', { timeout: 60000 }).should('be.visible')
      cy.get('input[name="username"]').clear().type('Admin')
      cy.get('input[name="password"]', { timeout: 60000 }).clear().type('admin123')
      cy.get('button[type="submit"]').click()
      cy.url({ timeout: 90000 }).should('include', '/dashboard')
    })

    // Navigate to Admin module
    cy.visit('/web/index.php/admin/viewSystemUsers')
    
    // WAIT FIX: Give the heavy Admin page 2 seconds to fully settle
    cy.wait(2000)
    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
  })

  // ================================
  // USER MANAGEMENT
  // ================================

  it('TC01 - displays Admin module landing page', () => {
    cy.url({ timeout: 30000 }).should('include', '/admin/viewSystemUsers')
    cy.contains('h5', 'System Users', { timeout: 30000 }).should('be.visible')
  })

  it('TC02 - searches for an existing system user by username', () => {
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Username')
      .parent().parent().find('input').type('Admin')

    cy.contains('button', 'Search', { timeout: 30000 }).click()
    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 }).should('have.length.at.least', 1)
  })

  it('TC03 - resets the user search filter', () => {
    const usernameInput = () =>
      cy.get('.oxd-input-group', { timeout: 30000 })
        .contains('Username')
        .parent().parent().find('input')

    usernameInput().type('Admin').should('have.value', 'Admin')
    cy.contains('button', 'Reset', { timeout: 30000 }).click()
    usernameInput().should('have.value', '', { timeout: 30000 })
  })

  it('TC04 - opens the Add User form', () => {
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/saveSystemUser')
  })

  it('TC05 - validates required fields on Add User form', () => {
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Required', { timeout: 30000 }).should('be.visible')
  })

  it('TC05.5 - creates a new system user successfully', () => {
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/saveSystemUser')

    // 1. User Role
    cy.get('.oxd-input-group').contains('User Role').parent().parent().find('.oxd-select-text').click()
    cy.get('.oxd-select-dropdown .oxd-select-option').contains('Admin').click()

    // 2. Employee Name (Autocomplete) 
    cy.get('.oxd-input-group').contains('Employee Name').parent().parent().find('input').type('m')
    cy.intercept('GET', '**/employees*').as('getEmployees')
    cy.wait('@getEmployees', { timeout: 20000 })
    cy.get('.oxd-autocomplete-dropdown .oxd-autocomplete-option', { timeout: 15000 }).first().click({ force: true })

    // 3. Status
    cy.get('.oxd-input-group').contains('Status').parent().parent().find('.oxd-select-text').click()
    cy.get('.oxd-select-dropdown .oxd-select-option').contains('Enabled').click()

    // 4. Credentials
    cy.get('.oxd-input-group').contains('Username').parent().parent().find('input').type(newUsername)
    cy.get('.oxd-input-group').contains('Password').first().parent().parent().find('input').type('Password123!')
    cy.get('.oxd-input-group').contains('Confirm Password').parent().parent().find('input').type('Password123!')

    // 5. Save
    cy.contains('button', 'Save').click()
    cy.contains('Successfully Saved', { timeout: 30000 }).should('be.visible')
  })

  it('TC05.6 - searches and verifies the newly created user exists', () => {
    cy.get('.oxd-input-group').contains('Username').parent().parent().find('input').type(newUsername)
    cy.contains('button', 'Search').click()
    
    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 }).should('have.length.at.least', 1)
    cy.contains('.oxd-table-card', newUsername).should('be.visible')
  })

  it('TC05.7 - edits the newly created user role', () => {
    cy.get('.oxd-input-group').contains('Username').parent().parent().find('input').type(newUsername)
    cy.contains('button', 'Search').click()
    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')

    cy.get('.oxd-table-body .oxd-table-card').first().find('button[title="Edit"]').click()
    cy.url({ timeout: 30000 }).should('include', '/admin/saveSystemUser/')

    cy.get('.oxd-input-group').contains('Status').parent().parent().find('.oxd-select-text').click()
    cy.get('.oxd-select-dropdown .oxd-select-option').contains('Disabled').click()
    
    cy.contains('button', 'Save').click()
    cy.contains('Successfully Updated', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // JOB TITLES
  // ================================

  it('TC06 - navigates to Job Titles page', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Job Titles', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewJobTitleList')
  })

  it('TC07 - adds a new job title successfully', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Job Titles', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/saveJobTitle')

    cy.get('.oxd-input-group').contains('Job Title').parent().parent().find('input').type(`QA Engineer ${timestamp}`)
    cy.get('.oxd-input-group').contains('Job Description').parent().parent().find('textarea').type('Automated test job title')
    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Successfully Saved', { timeout: 60000 }).should('be.visible')
  })

  it('TC08 - verifies the newly created job title appears in the list', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Job Titles', { timeout: 30000 }).click()
    cy.get('.oxd-table-body', { timeout: 30000 }).should('contain.text', `QA Engineer ${timestamp}`)
  })

  // ================================
  // LOCATIONS
  // ================================

  it('TC09 - navigates to Locations page', () => {
    cy.contains(TAB, 'Organization', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Locations', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewLocations')
  })

  it('TC10 - adds a new location successfully', () => {
    cy.contains(TAB, 'Organization', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Locations', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()

    cy.get('.oxd-input-group').contains('Name').parent().parent().find('input').type(newLocation.name)
    cy.get('.oxd-input-group').contains('City').parent().parent().find('input').type(newLocation.city)

    cy.get('.oxd-input-group').contains('Country').parent().parent().find('.oxd-select-text').click()
    cy.get('.oxd-select-dropdown').contains(newLocation.country).click()

    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Successfully Saved', { timeout: 60000 }).should('be.visible')
  })

  it('TC11 - verifies the newly created location appears in the list', () => {
    cy.contains(TAB, 'Organization', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Locations', { timeout: 30000 }).click()
    cy.get('.oxd-table-body', { timeout: 30000 }).should('contain.text', newLocation.name)
  })

  // ================================
  // ORGANIZATION - GENERAL INFORMATION
  // ================================

  it('TC12 - navigates to General Information page', () => {
    cy.contains(TAB, 'Organization', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'General Information', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewOrganizationGeneralInformation')
  })

  it('TC13 - verifies General Information form loads', () => {
    cy.contains(TAB, 'Organization', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'General Information', { timeout: 30000 }).click()
    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // JOB - PAY GRADES
  // ================================

  it('TC14 - navigates to Pay Grades page', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Pay Grades', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewPayGrades')
  })

  it('TC15 - verifies Pay Grades page has Add button', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Pay Grades', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  it('TC16 - opens Add Pay Grade form', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Pay Grades', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/payGrade')
  })

  // ================================
  // JOB - EMPLOYMENT STATUS
  // ================================

  it('TC17 - navigates to Employment Status page', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Employment Status', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/employmentStatus')
  })

  it('TC18 - verifies Employment Status page has Add button', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Employment Status', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // JOB - JOB CATEGORIES & WORK SHIFTS
  // ================================

  it('TC19 - navigates to Job Categories page', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Job Categories', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/jobCategory')
  })

  it('TC20 - navigates to Work Shifts page', () => {
    cy.contains(TAB, 'Job', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Work Shifts', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/workShift')
  })

  // ================================
  // QUALIFICATIONS
  // ================================

  it('TC21 - navigates to Skills page', () => {
    cy.contains(TAB, 'Qualifications', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Skills', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewSkills')
  })

  it('TC22 - verifies Skills page has Add button', () => {
    cy.contains(TAB, 'Qualifications', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Skills', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  it('TC23 - navigates to Education page', () => {
    cy.contains(TAB, 'Qualifications', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Education', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewEducation')
  })

  it('TC24 - navigates to Licenses page', () => {
    cy.contains(TAB, 'Qualifications', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Licenses', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewLicenses')
  })

  it('TC25 - navigates to Languages page', () => {
    cy.contains(TAB, 'Qualifications', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Languages', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/viewLanguages')
  })

  it('TC26 - navigates to Memberships page', () => {
    cy.contains(TAB, 'Qualifications', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Memberships', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/admin/membership')
  })

  // ================================
  // NATIONALITIES & BRANDING (FORCE CLICK FIXES)
  // ================================

  it('TC27 - navigates to Nationalities page', () => {
    // FORCE CLICK FIX: Stops Cypress from failing if the menu animation is stuck
    cy.contains(TAB, 'Nationalities', { timeout: 30000 }).click({ force: true })
    cy.url({ timeout: 30000 }).should('include', '/admin/nationality')
  })

  it('TC28 - verifies Nationalities page has Add button', () => {
    cy.contains(TAB, 'Nationalities', { timeout: 30000 }).click({ force: true })
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  it('TC29 - navigates to Corporate Branding page', () => {
    cy.contains(TAB, 'Corporate Branding', { timeout: 30000 }).click({ force: true })
    cy.url({ timeout: 30000 }).should('include', '/admin/addTheme')
  })

  // ================================
  // CONFIGURATION (FORCE CLICK FIXES)
  // ================================

  it('TC30 - opens Configuration dropdown', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click({ force: true })
    cy.contains('.oxd-dropdown-menu li', 'Email Configuration', { timeout: 30000 }).should('be.visible')
  })

  it('TC31 - navigates to Email Configuration page', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click({ force: true })
    cy.contains('.oxd-dropdown-menu li', 'Email Configuration', { timeout: 30000 }).click({ force: true })
    cy.url({ timeout: 30000 }).should('include', '/admin/listMailConfiguration')
  })

  it('TC32 - navigates to Localization page', () => {
    cy.contains(TAB, 'Configuration', { timeout: 30000 }).click({ force: true })
    cy.contains('.oxd-dropdown-menu li', 'Localization', { timeout: 30000 }).click({ force: true })
    cy.url({ timeout: 30000 }).should('include', '/admin/localization')
  })

})