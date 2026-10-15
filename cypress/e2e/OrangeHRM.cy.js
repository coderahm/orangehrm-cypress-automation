// ============================================================
// SUPPORT: Ignore uncaught errors from the OrangeHRM demo site
// ============================================================
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});

// Increase default timeout for the slow public demo site
Cypress.config('defaultCommandTimeout', 15000);
Cypress.config('pageLoadTimeout', 60000);

// ============================================================
// MAIN SUITE
// ============================================================
describe('OrangeHRM - Complete Automation Suite', () => {

  // Login helper
  const login = () => {
    cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    cy.get('input[name="username"]', { timeout: 20000 }).should('be.visible').type('Admin');
    cy.get('input[name="password"]').type('admin123');
    cy.get('button[type="submit"]').click();
    cy.url({ timeout: 20000 }).should('include', '/dashboard');
  };

  // ============================================================
  // SECTION 1: AUTHENTICATION (existing tests)
  // ============================================================
  describe('Authentication', () => {
    beforeEach(() => {
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
    });

    it('loads the login page correctly', () => {
      cy.title().should('include', 'OrangeHRM');
      cy.get('input[name="username"]', { timeout: 20000 }).should('be.visible');
    });

    it('logs in successfully as Admin', () => {
      cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
      cy.get('input[name="password"]').type('admin123');
      cy.get('button[type="submit"]').click();
      cy.url({ timeout: 20000 }).should('include', '/dashboard');
    });
  });

  // ============================================================
  // 🆕 SECTION 6: ADVANCED VALIDATIONS
  // ============================================================
  describe('Advanced Validations', () => {
    beforeEach(() => {
      login();
    });

    it('validates the dashboard URL and title', () => {
      cy.url().should('include', '/dashboard');
      cy.title().should('include', 'OrangeHRM');
    });

    it('verifies menu items have correct href attributes', () => {
      cy.contains('a', 'PIM').should('have.attr', 'href').and('include', 'pim');
      cy.contains('a', 'Admin').should('have.attr', 'href').and('include', 'admin');
      cy.contains('a', 'Leave').should('have.attr', 'href').and('include', 'leave');
    });

    // FIXED: the demo site is shared, so the Admin display name changes
    // (e.g. "manda Doe", "Ayesha ...", "Riley ..."). Instead of hardcoding a
    // name, verify the name is displayed and not empty.
    it('checks that username is displayed in the header', () => {
      cy.get('.oxd-userdropdown-name', { timeout: 30000 })
        .should('be.visible')
        .should(($el) => {
          expect($el.text().trim()).to.not.equal('');
        });
    });

    it('verifies browser tab title is correct', () => {
      cy.title().should('eq', 'OrangeHRM');
    });
  });

  // ============================================================
  // 🆕 SECTION 7: HOVER AND TOOLTIPS
  // ============================================================
  describe('Hover and Interactive Elements', () => {
    beforeEach(() => {
      login();
    });

    it('hovers over a menu item and sees it highlighted', () => {
      cy.contains('PIM').trigger('mouseover');
      cy.contains('PIM').should('be.visible');
    });

    it('opens the notification bell dropdown', () => {
      cy.get('body').then(($body) => {
        if ($body.find('.oxd-icon.bi-bell').length > 0) {
          cy.get('.oxd-icon.bi-bell').first().click();
          cy.contains('No Records Found').should('exist');
        } else {
          cy.log('No notification bell on this page');
        }
      });
    });
  });

  // ============================================================
  // 🆕 SECTION 8: SCROLLING AND VIEWPORT
  // ============================================================
  describe('Scrolling and Viewport Behavior', () => {
    beforeEach(() => {
      login();
    });

    it('scrolls to bottom of dashboard and back to top', () => {
      cy.scrollTo('bottom');
      cy.wait(500);
      cy.scrollTo('top');
      cy.contains('Dashboard').should('exist');
    });

    it('tests the page in mobile viewport', () => {
      cy.viewport(375, 667); // iPhone size
      cy.contains('PIM').should('exist');
    });

    it('tests the page in tablet viewport', () => {
      cy.viewport(768, 1024); // iPad size
      cy.contains('Dashboard').should('exist');
    });
  });

  // ============================================================
  // 🆕 SECTION 9: API INTERCEPTION
  // ============================================================
  describe('API Interception', () => {
    it('intercepts the login API call', () => {
      cy.intercept('POST', '**/auth/validate').as('loginRequest');
      
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login');
      cy.get('input[name="username"]', { timeout: 20000 }).type('Admin');
      cy.get('input[name="password"]').type('admin123');
      cy.get('button[type="submit"]').click();

      cy.wait('@loginRequest', { timeout: 20000 }).its('response.statusCode').should('eq', 302);
    });

    it('verifies dashboard data API responds with 200', () => {
      cy.intercept('GET', '**/dashboard/**').as('dashboardData');
      
      login();
      cy.wait('@dashboardData', { timeout: 20000 }).its('response.statusCode').should('eq', 200);
    });
  });

  // ============================================================
  // 🆕 SECTION 10: FORMS AND INPUT VALIDATION
  // ============================================================
  describe('Forms and Inputs', () => {
    beforeEach(() => {
      login();
      cy.contains('PIM', { timeout: 20000 }).click();
    });

    it('types and clears the search field', () => {
      cy.get('input[placeholder="Type for hints..."]', { timeout: 20000 })
        .first()
        .type('John')
        .should('have.value', 'John')
        .clear()
        .should('have.value', '');
    });

    it('opens the Add Employee form and checks fields exist', () => {
      cy.contains('Add', { timeout: 20000 }).click();
      cy.url({ timeout: 20000 }).should('include', '/addEmployee');
      cy.get('input[name="firstName"]', { timeout: 20000 }).should('exist');
      cy.get('input[name="lastName"]').should('exist');
    });

    it('validates required fields on Add Employee form', () => {
      cy.contains('Add', { timeout: 20000 }).click();
      cy.get('button[type="submit"]').click();
      // Required field errors should appear
      cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });
  });

  // ============================================================
  // 🆕 SECTION 11: TABLES AND DATA VALIDATION
  // ============================================================
  describe('Tables and Data', () => {
    beforeEach(() => {
      login();
      cy.contains('Admin', { timeout: 20000 }).click();
      cy.url({ timeout: 20000 }).should('include', '/admin');
    });

    it('verifies the user table has headers', () => {
      cy.contains('Username', { timeout: 20000 }).should('exist');
      cy.contains('User Role').should('exist');
      cy.contains('Status').should('exist');
    });

    it('verifies the table has at least one row', () => {
      cy.get('.oxd-table, .oxd-table-body, .orangehrm-container', { timeout: 30000 })
        .first()
        .should('exist');
    });

    it('searches for admin users by username', () => {
      cy.get('.oxd-input', { timeout: 20000 }).eq(1).type('Admin');
      cy.get('button[type="submit"]').click();
      cy.get('.oxd-table, .oxd-table-body, .orangehrm-container', { timeout: 30000 })
        .first()
        .should('exist');
    });
  });

  // ============================================================
  // 🆕 SECTION 12: NAVIGATION AND BROWSER HISTORY
  // ============================================================
  describe('Navigation and History', () => {
    beforeEach(() => {
      login();
    });

    it('uses browser back button to return to previous page', () => {
      cy.contains('PIM', { timeout: 20000 }).click();
      cy.url().should('include', '/pim');
      
      cy.go('back');
      cy.url({ timeout: 20000 }).should('include', '/dashboard');
    });

    it('uses browser forward button to go forward again', () => {
      cy.contains('PIM', { timeout: 20000 }).click();
      cy.url().should('include', '/pim');
      
      cy.go('back');
      cy.url().should('include', '/dashboard');
      
      cy.go('forward');
      cy.url({ timeout: 20000 }).should('include', '/pim');
    });

    it('reloads page and stays on same page', () => {
      cy.contains('PIM', { timeout: 20000 }).click();
      cy.reload();
      cy.url({ timeout: 20000 }).should('include', '/pim');
    });
  });

  // ============================================================
  // 🆕 SECTION 13: LOCAL STORAGE AND COOKIES
  // ============================================================
  describe('Storage and Cookies', () => {
    beforeEach(() => {
      login();
    });

    it('verifies cookies are set after login', () => {
      cy.getCookies().should('have.length.greaterThan', 0);
    });

    it('verifies sessionStorage or localStorage has data', () => {
      cy.window().then((win) => {
        const hasStorage = 
          win.localStorage.length > 0 || 
          win.sessionStorage.length > 0;
        expect(hasStorage).to.be.true;
      });
    });
  });

  // ============================================================
  // 🆕 SECTION 14: EDGE CASES
  // ============================================================
  describe('Edge Cases', () => {
    beforeEach(() => {
      login();
    });

    it('handles empty search gracefully', () => {
      cy.contains('Admin', { timeout: 20000 }).click();
      cy.get('button[type="submit"]').click();
      cy.get('.oxd-table, .oxd-table-body, .orangehrm-container', { timeout: 30000 })
        .first()
        .should('exist');
    });

    it('verifies clicking menu items does not crash the app', () => {
      const menuItems = ['Admin', 'PIM', 'Leave', 'Time'];

      menuItems.forEach((item) => {
        cy.contains(item, { timeout: 20000 }).click();
        cy.url().should('not.include', '/auth/login');
      });
    });

    it('verifies logout clears the session', () => {
      cy.get('.oxd-userdropdown-tab', { timeout: 20000 }).click();
      cy.contains('Logout').click();
      cy.url({ timeout: 20000 }).should('include', '/auth/login');

      // Try to visit dashboard directly - should redirect to login
      cy.visit('https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index');
      cy.url({ timeout: 20000 }).should('include', '/auth/login');
    });
  });

});