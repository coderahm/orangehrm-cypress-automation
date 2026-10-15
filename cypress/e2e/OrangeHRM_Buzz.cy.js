describe('OrangeHRM - Buzz Module', () => {

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

    // 3. Navigate to Buzz module
    cy.get('.oxd-main-menu-item', { timeout: 30000 })
      .contains('Buzz')
      .should('be.visible')
      .click()

    // 4. Confirm we're on the Buzz feed page
    cy.url({ timeout: 60000 }).should('include', '/buzz/viewBuzz')
  })

  // ================================
  // LANDING PAGE
  // ================================

  it('TC01 - displays Buzz module landing page', () => {
    cy.url({ timeout: 30000 }).should('include', '/buzz/viewBuzz')
    cy.contains('h6', 'Buzz', { timeout: 30000 }).should('be.visible')
  })

  it('TC02 - verifies the post input field is visible', () => {
    // Buzz has a textarea for posting
    cy.get('.oxd-buzz-post-input', { timeout: 30000 })
      .should('be.visible')
      .and('have.attr', 'placeholder')
  })

  it('TC03 - verifies the Post button is present', () => {
    cy.contains('button', 'Post', { timeout: 30000 }).should('be.visible')
  })

  // ================================
  // POST INTERACTIONS
  // ================================

  it('TC04 - types text into the post input field', () => {
    const testPost = `Automated test post ${Date.now()}`

    cy.get('.oxd-buzz-post-input', { timeout: 30000 })
      .should('be.visible')
      .type(testPost)
      .should('have.value', testPost)
  })

  it('TC05 - verifies the post input accepts multiline text', () => {
    const line1 = 'First line of automation test'
    const line2 = 'Second line'

    cy.get('.oxd-buzz-post-input', { timeout: 30000 })
      .should('be.visible')
      .type(line1)
      .type('{enter}')
      .type(line2)

    // Verify the input contains both lines
    cy.get('.oxd-buzz-post-input').should('contain.value', line1)
    cy.get('.oxd-buzz-post-input').should('contain.value', line2)
  })

  // ================================
  // BUZZ FEED CONTENT
  // ================================

  it('TC06 - verifies the buzz feed has posts', () => {
    // The feed loads posts from other users
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')
    cy.get('.orangehrm-buzz-newsfeed-posts', { timeout: 30000 })
      .should('have.length.at.least', 1)
  })

  it('TC07 - verifies post content displays', () => {
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')

    // Verify at least one post has text content
    cy.get('.orangehrm-buzz-post-body', { timeout: 30000 })
      .should('have.length.at.least', 1)
  })

  it('TC08 - verifies post action buttons are present', () => {
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')

    // Each post has a comment button and/or like button
    cy.get('.orangehrm-buzz-post-footer', { timeout: 30000 })
      .should('have.length.at.least', 1)
  })

  // ================================
  // SIDEBAR / FILTERS
  // ================================

    it('TC09 - verifies the Buzz feed UI is present', () => {
    cy.get('.oxd-form-loader', { timeout: 60000 }).should('not.exist')

    // Buzz page has a post input area at the top and a newsfeed below
    cy.get('.oxd-buzz-post-input', { timeout: 30000 }).should('be.visible')

    // The feed area displays posts
    cy.get('.orangehrm-buzz-newsfeed, .orangehrm-buzz-newsfeed-posts', { timeout: 30000 })
      .should('have.length.at.least', 1)
  })

  it('TC10 - verifies the page loads without errors', () => {
    cy.get('.oxd-form', { timeout: 30000 }).should('be.visible')
    cy.contains('Error', { timeout: 5000 }).should('not.exist')
  })

})