describe('OrangeHRM - Recruitment Module', () => {

  const timestamp = Date.now()

  const newVacancy = {
    name: `QA Automation ${timestamp}`,
    positions: '2',
  }

  const newCandidate = {
    firstName: `Cand${timestamp}`,
    lastName: 'Tester',
    email: `candidate${timestamp}@test.com`,
    contact: '03001234567',
  }

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get('input[name="username"]', { timeout: 60000 }).should('be.visible')
    cy.get('input[name="username"]').clear().type('Admin')
    cy.get('input[name="password"]').clear().type('admin123')
    cy.get('button[type="submit"]').click()

    cy.url({ timeout: 60000 }).should('include', '/dashboard')
    cy.get('.oxd-main-menu', { timeout: 60000 }).should('be.visible')
    cy.wait(2000)

    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Recruitment')
      .should('be.visible')
      .click()

    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/recruitment/viewCandidates')
  })

  // ================================
  // LANDING
  // ================================

  it('TC01 - displays Recruitment module landing page', () => {
    cy.contains('h5', 'Candidates', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Vacancies', { timeout: 30000 }).should('be.visible')
  })

  it('TC02 - navigates to Vacancies page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Vacancies', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewJobVacancy')
  })

  // ================================
  // VACANCIES
  // ================================

  it('TC03 - adds a new vacancy successfully', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Vacancies', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewJobVacancy')

    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/addJobVacancy')

    // Vacancy Name
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Vacancy Name')
      .parent().parent().find('input').type(newVacancy.name)

    // Job Title dropdown
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Job Title')
      .parent().parent().find('.oxd-select-text').click()
    cy.get('.oxd-select-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-select-option')
      .first()
      .click()

    // Description
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Description')
      .parent().parent().find('textarea').type('Automated test vacancy')

    // Hiring Manager — REMOVED. The demo's autocomplete does not return results.

    // Number of Positions
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Number of Positions')
      .parent().parent().find('input').clear().type(newVacancy.positions)

    // Save
    cy.contains('button', 'Save', { timeout: 30000 }).click()

    // Check for form errors before asserting success
    cy.wait(3000)
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-input-field-error-message').length > 0) {
        const err = $body.find('.oxd-input-field-error-message').first().text()
        throw new Error(`Save blocked: ${err}`)
      }
    })

    cy.contains('Successfully Saved', { timeout: 60000 }).should('be.visible')
  })

  it('TC04 - verifies the newly created vacancy appears in the list', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Vacancies', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewJobVacancy')
    cy.get('.oxd-table-body', { timeout: 30000 }).should('contain.text', newVacancy.name)
  })

  // ================================
  // CANDIDATES
  // ================================

  it('TC05 - navigates to Candidates page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewCandidates')
    cy.contains('h5', 'Candidates', { timeout: 30000 }).should('be.visible')
  })

  it('TC06 - validates required fields on Add Candidate form', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/addCandidate')

    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Required', { timeout: 30000 }).should('be.visible')
    cy.get('.oxd-input-field-error-message').should('have.length.at.least', 2)
  })

  it('TC07 - adds a new candidate successfully', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/addCandidate')

    // First Name
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('First Name')
      .parent().parent().find('input').type(newCandidate.firstName)

    // Last Name
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Last Name')
      .parent().parent().find('input').type(newCandidate.lastName)

    // Vacancy dropdown (optional)
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Vacancy')
      .parent().parent().find('.oxd-select-text').click()
    cy.get('.oxd-select-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-select-option')
      .first()
      .click()

    // Email
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Email')
      .parent().parent().find('input').first().type(newCandidate.email)

    // Contact Number
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Contact Number')
      .parent().parent().find('input').type(newCandidate.contact)

    // Save
    cy.contains('button', 'Save', { timeout: 30000 }).click()

    // Confirm save
    cy.wait(3000)
    cy.get('body').then(($body) => {
      if ($body.find('.oxd-input-field-error-message').length > 0) {
        const err = $body.find('.oxd-input-field-error-message').first().text()
        throw new Error(`Save blocked: ${err}`)
      }
    })

    cy.contains('Successfully Saved', { timeout: 60000 }).should('be.visible')
  })

  it('TC08 - verifies the newly created candidate appears in the list', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewCandidates')

    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Candidate Name')
      .parent().parent().find('input').type(newCandidate.firstName)

    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option')
      .first()
      .click({ force: true })

    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .should('have.length.at.least', 1)
    cy.get('.oxd-table-body').should('contain.text', newCandidate.firstName)
  })

  // ================================
  // WORKFLOW
  // ================================

  it('TC09 - shortlists the candidate', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewCandidates')

    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Candidate Name')
      .parent().parent().find('input').type(newCandidate.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option').first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first()
      .find('.bi-eye-fill')
      .click({ force: true })

    cy.contains('h6', 'Application Stage', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Shortlist', { timeout: 30000 }).click()
    cy.get('.oxd-textarea', { timeout: 30000 }).type('Shortlisted by automation')
    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Successfully Updated', { timeout: 60000 }).should('be.visible')
  })

  it('TC10 - schedules an interview for the shortlisted candidate', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Candidate Name')
      .parent().parent().find('input').type(newCandidate.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option').first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first()
      .find('.bi-eye-fill')
      .click({ force: true })

    cy.contains('h6', 'Application Stage', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Schedule Interview', { timeout: 30000 }).click()

    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Interview Title')
      .parent().parent().find('input').type('Technical Interview')

    // Interviewer — may fail if demo has no data; use best-effort
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Interviewer')
      .parent().parent().find('input').first().clear().type('a', { delay: 400 })
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option').first().click({ force: true })

    const today = new Date()
    const dd = String(today.getDate()).padStart(2, '0')
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const yyyy = today.getFullYear()
    const dateStr = `${yyyy}-${dd}-${mm}`

    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Date')
      .parent().parent().find('input').clear().type(dateStr)

    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Time')
      .parent().parent().find('input').first().clear().type('10:00 AM')

    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.url({ timeout: 60000 }).should('include', '/viewCandidate')
  })

  it('TC11 - marks the interview as passed', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Candidate Name')
      .parent().parent().find('input').type(newCandidate.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option').first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first()
      .find('.bi-eye-fill')
      .click({ force: true })

    cy.contains('h6', 'Application Stage', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Mark Interview Passed', { timeout: 30000 }).click()

    cy.get('.oxd-textarea', { timeout: 30000 }).type('Passed by automation')
    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Successfully Updated', { timeout: 60000 }).should('be.visible')
  })

  it('TC12 - offers the job to the candidate', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Candidate Name')
      .parent().parent().find('input').type(newCandidate.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option').first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first()
      .find('.bi-eye-fill')
      .click({ force: true })

    cy.contains('h6', 'Application Stage', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Offer Job', { timeout: 30000 }).click()

    cy.get('.oxd-textarea', { timeout: 30000 }).type('Offered by automation')
    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Successfully Updated', { timeout: 60000 }).should('be.visible')
  })

  it('TC13 - hires the candidate', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Candidate Name')
      .parent().parent().find('input').type(newCandidate.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option').first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .first()
      .find('.bi-eye-fill')
      .click({ force: true })

    cy.contains('h6', 'Application Stage', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Hire', { timeout: 30000 }).click()

    cy.get('.oxd-textarea', { timeout: 30000 }).type('Hired by automation')
    cy.contains('button', 'Save', { timeout: 30000 }).click()
    cy.contains('Successfully Updated', { timeout: 60000 }).should('be.visible')
  })

  // ================================
  // CLEANUP
  // ================================

  it('TC14 - deletes the candidate', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Candidates', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewCandidates')

    cy.get('.oxd-input-group', { timeout: 30000 })
      .contains('Candidate Name')
      .parent().parent().find('input').type(newCandidate.firstName)
    cy.get('.oxd-autocomplete-dropdown', { timeout: 60000 })
      .should('be.visible')
      .find('.oxd-autocomplete-option').first().click({ force: true })
    cy.contains('button', 'Search', { timeout: 30000 }).click()

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .should('have.length.at.least', 1)

    cy.get('.oxd-table-body .oxd-table-card')
      .first()
      .find('.bi-trash')
      .click({ force: true })

    cy.get('.orangehrm-dialog-popup', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Yes, Delete', { timeout: 60000 }).click()
    cy.contains('Successfully Deleted', { timeout: 60000 }).should('be.visible')
  })

  it('TC15 - deletes the vacancy', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Vacancies', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/recruitment/viewJobVacancy')

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .filter(`:contains("${newVacancy.name}")`)
      .first()
      .find('.bi-trash')
      .click({ force: true })

    cy.get('.orangehrm-dialog-popup', { timeout: 60000 }).should('be.visible')
    cy.contains('button', 'Yes, Delete', { timeout: 60000 }).click()
    cy.contains('Successfully Deleted', { timeout: 60000 }).should('be.visible')
  })
  
})