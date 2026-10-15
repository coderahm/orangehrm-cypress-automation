describe('OrangeHRM - Time Module', () => {

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

    // 3. Navigate to Time module
    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Time')
      .should('be.visible')
      .click()

    // 4. Time module lands on Timesheets
    cy.url({ timeout: 60000 }).should('include', '/time')
  })

  // ================================
  // LANDING
  // ================================

  it('TC01 - displays Time module landing page', () => {
    cy.url({ timeout: 30000 }).should('include', '/time')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Timesheets', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Attendance', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Reports', { timeout: 30000 }).should('be.visible')
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Project Info', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // TIMESHEETS
  // ================================

  it('TC02 - navigates to Timesheets page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Timesheets', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'My Timesheets', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/viewMyTimesheet')
  })

  it('TC03 - displays current week timesheet', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Timesheets', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'My Timesheets', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/viewMyTimesheet')

    // Verify timesheet header / table
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.contains('h6', 'My Timesheet', { timeout: 30000 }).should('be.visible')
  })

     it('TC04 - verifies My Timesheet page displays correctly', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Timesheets', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'My Timesheets', { timeout: 30000 }).click()

    cy.url({ timeout: 60000 }).should('include', '/time/viewMyTimesheet')
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')

    // Verify the actual content shown on the My Timesheet page
    cy.contains('h6', 'My Timesheet', { timeout: 30000 }).should('be.visible')
    cy.contains('Timesheet Period', { timeout: 30000 }).should('be.visible')
  })

  it('TC05 - navigates to Employee Timesheets (supervisor view)', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Timesheets', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Employee Timesheets', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/viewEmployeeTimesheet')
  })

  // ================================
  // ATTENDANCE
  // ================================

  it('TC06 - navigates to Attendance > My Records', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Attendance', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'My Records', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/attendance/viewMyAttendanceRecord')
  })

  it('TC07 - navigates to Attendance > Punch In/Out', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Attendance', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Punch In/Out', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/attendance/punchIn')
  })

  it('TC08 - navigates to Attendance > Employee Records', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Attendance', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Employee Records', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/attendance/viewAttendanceRecord')
  })

  // ================================
  // REPORTS
  // ================================

  it('TC09 - navigates to Reports page', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Reports', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Project Reports', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/displayProjectReportCriteria')
  })

  it('TC10 - navigates to Employee Reports', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Reports', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Employee Reports', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/displayEmployeeReportCriteria')
  })

  it('TC11 - navigates to Attendance Summary report', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Reports', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Attendance Summary', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/displayAttendanceSummaryReportCriteria')
  })

  // ================================
  // PROJECT INFO
  // ================================

  it('TC12 - navigates to Project Info > Customers', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Project Info', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Customers', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/viewCustomers')
  })

  it('TC13 - navigates to Project Info > Projects', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Project Info', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Projects', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/viewProjects')
  })

  // ================================
  // FORM VALIDATION
  // ================================

  it('TC14 - displays Customer list with records', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Project Info', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Customers', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/viewCustomers')

    // Verify the table has rows
    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .should('have.length.at.least', 1)
  })

  it('TC15 - displays Projects list with records', () => {
    cy.contains('.oxd-topbar-body-nav-tab-item', 'Project Info', { timeout: 30000 }).click()
    cy.contains('.oxd-dropdown-menu li', 'Projects', { timeout: 30000 }).click()
    cy.url({ timeout: 30000 }).should('include', '/time/viewProjects')

    cy.get('.oxd-table-body .oxd-table-card', { timeout: 30000 })
      .should('have.length.at.least', 1)
  })

})