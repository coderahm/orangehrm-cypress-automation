class LoginPage {
  // 1. Define the selectors in one place
  elements = {
    usernameInput: () => cy.get('input[name="username"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    submitButton: () => cy.get('button[type="submit"]'),
    errorMessage: () => cy.get('.oxd-alert-content-text')
  }

  // 2. Define the actions
  visit() {
    cy.visit('/web/index.php/auth/login')
    return this
  }

  typeUsername(username) {
    this.elements.usernameInput().clear().type(username)
    return this
  }

  typePassword(password) {
    this.elements.passwordInput().clear().type(password)
    return this
  }

  clickSubmit() {
    this.elements.submitButton().click()
    return this
  }

  // Combine into a reusable login flow
  login(username, password) {
    this.typeUsername(username)
    this.typePassword(password)
    this.clickSubmit()
    return this
  }
}

// Export it so tests can use it
export default new LoginPage()