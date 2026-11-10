describe('OrangeHRM Login - Full Edge Case Suite', () => {

  // Setup: Go to the login page before each test
  beforeEach(() => {
    // failOnStatusCode: false prevents Cypress from crashing if the demo server returns a 500 error
    cy.visit('/web/index.php/auth/login', { failOnStatusCode: false })
    cy.get('input[name="username"]', { timeout: 60000 }).should('be.visible')
  })

  // ==========================================
  // 1. HAPPY PATH
  // ==========================================

  it('logs in successfully with valid credentials', () => {
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.url({ timeout: 30000 }).should('include', '/dashboard')
  })

  // ==========================================
  // 2. INVALID CREDENTIALS
  // ==========================================

  it('shows error for invalid username', () => {
    cy.get('input[name="username"]').type('WrongUser')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
  })

  it('shows error for invalid password', () => {
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('WrongPassword')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
  })

  it('shows error for empty username', () => {
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.contains('Required').should('be.visible')
  })

  it('shows error for empty password', () => {
    cy.get('input[name="username"]').type('Admin')
    cy.get('button[type="submit"]').click()
    cy.contains('Required').should('be.visible')
  })

  // ==========================================
  // 3. INPUT EDGE CASES (Whitespace, Length, Case)
  // ==========================================

  it('handles whitespace-only username', () => {
    cy.get('input[name="username"]').type('   ')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    // Should show required or invalid credentials
    cy.contains('Required').should('be.visible')
  })

  it('handles very long username (300 chars)', () => {
    cy.get('input[name="username"]').invoke('val', 'A'.repeat(300))
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible')
  })

  it('handles very long password (500 chars)', () => {
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').invoke('val', 'P'.repeat(500))
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible')
  })

  // ==========================================
  // 4. SECURITY & CASE HANDLING
  // ==========================================

  it('blocks SQL injection attempt', () => {
    cy.get('input[name="username"]').type("Admin' OR 1=1 --")
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.get('.oxd-alert-content-text').should('be.visible')
  })

  it('handles case sensitivity (lowercase admin)', () => {
    cy.get('input[name="username"]').type('admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    // Depending on the app config, this either logs in or shows an error. 
    // Usually, OrangeHRM usernames are case-sensitive.
    cy.get('.oxd-alert-content-text').should('contain', 'Invalid credentials')
  })

  // ==========================================
  // 5. UX BEHAVIOR & UI VALIDATION
  // ==========================================

  it('masks the password input field', () => {
    cy.get('input[name="password"]').should('have.attr', 'type', 'password')
  })

  it('allows toggling password visibility', () => {
    cy.get('input[name="password"]').type('admin123')
    // Click the eye icon to show password
    cy.get('.oxd-icon.bi-eye-slash').click()
    cy.get('input[name="password"]').should('have.attr', 'type', 'text')
  })

  it('has a visible "Forgot your password?" link', () => {
    cy.contains('Forgot your password?').should('be.visible').click()
    cy.url().should('include', '/requestPasswordResetCode')
  })

  // ==========================================
  // 6. SESSION MANAGEMENT
  // ==========================================

  it('redirects to login when accessing dashboard without session', () => {
    // Try to visit dashboard without logging in
    cy.visit('/web/index.php/dashboard/index', { failOnStatusCode: false })
    cy.url().should('include', '/auth/login')
  })

  it('persists session after page reload', () => {
    // 1. Log in
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')

    // 2. Reload the page
    cy.reload()

    // 3. Should still be on the dashboard, not kicked out
    cy.url().should('include', '/dashboard')
  })

  it('logs out successfully and returns to login page', () => {
    // 1. Log in
    cy.get('input[name="username"]').type('Admin')
    cy.get('input[name="password"]').type('admin123')
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')

    // 2. Click user dropdown and Logout
    cy.get('.oxd-userdropdown-tab').click()
    cy.get('a[href="/web/index.php/auth/logout"]').click()

    // 3. Verify we are back at login
    cy.url().should('include', '/auth/login')
  })
})