class PimPage {
  elements = {
    addButton: () => cy.contains('button', 'Add'),
    firstNameInput: () => cy.get('input[name="firstName"]'),
    lastNameInput: () => cy.get('input[name="lastName"]'),
    saveButton: () => cy.contains('button', 'Save'),
    searchNameInput: () => cy.get('input[placeholder="Type for hints..."]').first(),
    searchButton: () => cy.contains('button', 'Search'),
    tableRows: () => cy.get('.oxd-table-body .oxd-table-card'),
    employeeIdInput: () => cy.get('.oxd-input-group').contains('Employee Id').parent().parent().find('input'),
  }

  visit() {
    cy.visit('/web/index.php/pim/viewEmployeeList')
    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    return this
  }

  clickAdd() {
    this.elements.addButton().click()
    return this
  }

  fillEmployeeDetails(firstName, lastName, id) {
    this.elements.firstNameInput().type(firstName)
    this.elements.lastNameInput().type(lastName)
    this.elements.employeeIdInput().clear().type(id)
    return this
  }

  clickSave() {
    this.elements.saveButton().click()
    return this
  }

  searchEmployee(name) {
    this.elements.searchNameInput().type(name)
    cy.get('.oxd-autocomplete-dropdown .oxd-autocomplete-option', { timeout: 30000 })
      .should('be.visible').first().click({ force: true })
    this.elements.searchButton().click()
    cy.get('.oxd-form-loader', { timeout: 90000 }).should('not.exist')
    return this
  }
}

export default new PimPage()