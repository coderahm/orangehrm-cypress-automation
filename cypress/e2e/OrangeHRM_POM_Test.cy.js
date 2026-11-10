import LoginPage from '../pages/LoginPage'
import PimPage from '../pages/PimPage'

describe('OrangeHRM - Refactored with POM', () => {
  const timestamp = Date.now()

  beforeEach(() => {
    // 1. Use the Login Page object (Notice how we don't use cy.get() here!)
    LoginPage.visit().login('Admin', 'admin123')
    cy.url().should('include', '/dashboard')
  })

  it('TC01 - successfully logs in', () => {
    cy.contains('h6', 'Dashboard').should('be.visible')
  })

  it('TC02 - creates a new employee using POM', () => {
    // 2. Use the PIM Page object (Notice how clean this is!)
    PimPage.visit()
    PimPage.clickAdd()
    PimPage.fillEmployeeDetails(`POM_${timestamp}`, 'Framework', `POM${timestamp.toString().slice(-5)}`)
    PimPage.clickSave()
    
    cy.contains('h6', 'Personal Details', { timeout: 30000 }).should('be.visible')
  })

  it('TC03 - searches for the created employee', () => {
    PimPage.visit().searchEmployee(`POM_${timestamp}`)
    PimPage.elements.tableRows().should('have.length.at.least', 1)
  })
})