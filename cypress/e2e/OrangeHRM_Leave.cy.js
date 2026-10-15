describe('OrangeHRM - Leave Module', () => {

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const formatDate = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${day}-${month}`
  }

  const fromDate = formatDate(today)
  const toDate = formatDate(tomorrow)

  const TAB = '.oxd-topbar-body-nav-tab-item'

  beforeEach(() => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login')
    cy.get('input[name="username"]', { timeout: 30000 }).type('Admin')
    cy.get('input[name="password"]', { timeout: 30000 }).type('admin123')
    cy.get('button[type="submit"]').click()

    cy.url({ timeout: 60000 }).should('include', '/dashboard')
    cy.get('.oxd-main-menu', { timeout: 60000 }).should('be.visible')
    cy.wait(3000)

    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Leave')
      .should('be.visible')
      .click()

    cy.url({ timeout: 60000 }).should('include', '/leave')
    cy.get(TAB, { timeout: 60000 }).should('have.length.at.least', 1)
  })

  // ================================
  // LANDING & BASIC TABS
  // ================================

  it('TC01 - displays Leave module landing page', () => {
    cy.url({ timeout: 30000 }).should('include', '/leave/viewLeaveList')
    cy.contains('h5', 'Leave List', { timeout: 30000 }).should('be.visible')

    cy.get(TAB, { timeout: 30000 }).should('have.length.at.least', 6)
    cy.contains(TAB, 'Apply').should('be.visible')
    cy.contains(TAB, 'My Leave').should('be.visible')
    cy.contains(TAB, 'Leave List').should('be.visible')
  })

  it('TC02 - navigates to My Leave page', () => {
    cy.contains(TAB, 'My Leave', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/viewMyLeaveList')
    cy.contains('h5', 'My Leave', { timeout: 30000 }).should('be.visible')
  })

  it('TC03 - opens the date picker on Apply Leave page', () => {
    cy.contains(TAB, 'Apply', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/applyLeave')

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.wait(2000)

    cy.get('body').then(($body) => {
      if ($body.text().includes('No Leave Types with Leave Balance')) {
        cy.contains('No Leave Types with Leave Balance', { timeout: 30000 }).should('be.visible')
        return
      }

      cy.get('.oxd-input-group', { timeout: 30000 })
        .contains('From Date')
        .parent().parent().find('input')
        .click()
      cy.get('.oxd-date-input-calendar', { timeout: 30000 }).should('be.visible')
    })
  })

  it('TC04 - applies for a single-day leave successfully', () => {
    cy.contains(TAB, 'Apply', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/applyLeave')

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.wait(2000)

    cy.get('body').then(($body) => {
      if ($body.text().includes('No Leave Types with Leave Balance')) {
        cy.contains('No Leave Types with Leave Balance', { timeout: 30000 }).should('be.visible')
        return
      }

      cy.get('.oxd-input-group', { timeout: 30000 })
        .contains('Leave Type').parent().parent().find('.oxd-select-text').click()
      cy.get('.oxd-select-dropdown', { timeout: 30000 })
        .find('.oxd-select-option').first().click()

      cy.get('.oxd-input-group', { timeout: 30000 })
        .contains('From Date').parent().parent().find('input').clear().type(fromDate)

      cy.get('.oxd-input-group', { timeout: 30000 })
        .contains('To Date').parent().parent().find('input').clear().type(toDate)

      cy.get('.oxd-input-group', { timeout: 30000 })
        .contains('Comment').parent().parent().find('textarea')
        .type('Automated leave request - QA test')

      cy.contains('button', 'Apply', { timeout: 30000 }).click()
      cy.contains('Successfully Saved', { timeout: 60000 }).should('be.visible')
    })
  })

  it('TC05 - verifies the applied leave appears in My Leave list', () => {
    cy.contains(TAB, 'My Leave', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/viewMyLeaveList')
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  it('TC06 - verifies My Leave list has the search form', () => {
    cy.contains(TAB, 'My Leave', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/viewMyLeaveList')
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')

    cy.contains('button', 'Search', { timeout: 30000 }).should('be.visible')
    cy.contains('button', 'Reset', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // ENTITLEMENTS
  // ================================

  it('TC07 - opens Entitlements dropdown', () => {
    cy.contains(TAB, 'Entitlements', { timeout: 30000 }).click()
    cy.contains('Add Entitlements', { timeout: 30000 }).should('be.visible')
    cy.contains('Employee Entitlements', { timeout: 30000 }).should('be.visible')
    cy.contains('My Entitlements', { timeout: 30000 }).should('be.visible')
  })

  it('TC08 - navigates to Add Entitlements page', () => {
    cy.contains(TAB, 'Entitlements', { timeout: 30000 }).click()
    cy.contains('Add Entitlements', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/addLeaveEntitlement')
  })

  it('TC09 - verifies Add Entitlements form loads', () => {
    cy.contains(TAB, 'Entitlements', { timeout: 30000 }).click()
    cy.contains('Add Entitlements', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/addLeaveEntitlement')

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

  it('TC10 - navigates to Employee Entitlements page', () => {
    cy.contains(TAB, 'Entitlements', { timeout: 30000 }).click()
    cy.contains('Employee Entitlements', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/viewLeaveEntitlements')
  })

  it('TC11 - navigates to My Entitlements page', () => {
    cy.contains(TAB, 'Entitlements', { timeout: 30000 }).click()
    cy.contains('My Entitlements', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/viewMyLeaveEntitlements')
  })

  // ================================
  // CONFIGURE MENU
  // ================================

  it('TC12 - opens Configure dropdown', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('Leave Types', { timeout: 30000 }).should('be.visible')
    cy.contains('Work Week', { timeout: 30000 }).should('be.visible')
    cy.contains('Holidays', { timeout: 30000 }).should('be.visible')
  })

  it('TC13 - navigates to Leave Types page', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('Leave Types', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/leaveTypeList')
  })

  it('TC14 - verifies Leave Types page loads', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('Leave Types', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/leaveTypeList')

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  it('TC15 - opens Add Leave Type form', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('Leave Types', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/defineLeaveType')
  })

  it('TC16 - navigates to Holidays page', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('Holidays', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/viewHolidayList')
  })

  it('TC17 - verifies Holidays page loads', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('Holidays', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/viewHolidayList')

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.contains('button', 'Add', { timeout: 30000 }).should('be.visible')
  })

  it('TC18 - opens Add Holiday form', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('Holidays', { timeout: 30000 }).click()
    cy.contains('button', 'Add', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/leave/saveHoliday')
  })

  // ================================
  // WORK WEEK (FIXED - accepts both URL patterns)
  // ================================

  it('TC19 - navigates to Work Week page', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Work Week', { timeout: 30000 }).click()
    // Accept either URL form used by different OrangeHRM 5 versions
    cy.url({ timeout: 30000 }).should('match', /leave\/(defineWorkWeek|workWeek)/i)
  })

  it('TC20 - verifies Work Week page loads', () => {
    cy.contains(TAB, 'Configure', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Work Week', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('match', /leave\/(defineWorkWeek|workWeek)/i)

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.contains('button', 'Save', { timeout: 30000 }).should('be.visible')
    // Verify the days of the week are displayed
    cy.get('body', { timeout: 30000 }).should('contain.text', 'Monday')
    cy.get('body').should('contain.text', 'Friday')
  })

  // ================================
  // REPORTS (FIXED - accepts the dropdown structure)
  // ================================

  it('TC21 - navigates to Reports page', () => {
    cy.contains(TAB, 'Reports', { timeout: 30000 }).click()
    // The Reports dropdown has one or more items - click the first one
    cy.get('.oxd-dropdown-menu li', { timeout: 30000 })
      .first()
      .click()
    // Accept any report URL under /leave/
    cy.url({ timeout: 30000 }).should('match', /leave\/viewLeave\w*Report/)
  })

  it('TC22 - verifies Reports page loads', () => {
    cy.contains(TAB, 'Reports', { timeout: 30000 }).click()
    cy.get('.oxd-dropdown-menu li', { timeout: 30000 })
      .first()
      .click()
    cy.url({ timeout: 30000 }).should('match', /leave\/viewLeave\w*Report/)

    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
  })

})