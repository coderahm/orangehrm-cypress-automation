// ============================================================
// SUPPORT: Ignore uncaught errors from the demo site
// ============================================================
Cypress.on('uncaught:exception', () => false);

Cypress.config('defaultCommandTimeout', 15000);
Cypress.config('pageLoadTimeout', 60000);

// ============================================================
// CONSTANTS
// ============================================================
const LOGIN_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/auth/login';
const DASHBOARD_URL = 'https://opensource-demo.orangehrmlive.com/web/index.php/dashboard/index';
const VALID_USER = 'Admin';
const VALID_PASS = 'admin123';

// ============================================================
// HELPERS
// ============================================================
const visitLogin = () => {
  cy.visit(LOGIN_URL);
  cy.get('input[name="username"]', { timeout: 20000 }).should('be.visible');
};

const fillLogin = (username, password) => {
  if (username !== null) {
    cy.get('input[name="username"]').clear();
    if (username !== '') cy.get('input[name="username"]').type(username);
  }
  if (password !== null) {
    cy.get('input[name="password"]').clear();
    if (password !== '') cy.get('input[name="password"]').type(password);
  }
};

const submitLogin = () => {
  cy.get('button[type="submit"]').click();
};

const verifyLoginRejected = () => {
  cy.url({ timeout: 10000 }).should('include', '/auth/login');
  cy.url().should('not.include', '/dashboard');
};

const verifyLoginSucceeded = () => {
  cy.url({ timeout: 20000 }).should('include', '/dashboard');
};

// ============================================================
// MAIN SUITE
// ============================================================
describe('OrangeHRM Login - Full Edge Case Suite', () => {

  // ----------------------------------------------------------
  // 1. HAPPY PATH
  // ----------------------------------------------------------
  describe('1. Happy Path', () => {
    it('logs in successfully with valid credentials', () => {
      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      verifyLoginSucceeded();
    });

    it('shows the logged-in user name in the header', () => {
      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      cy.get('.oxd-userdropdown-name', { timeout: 20000 })
        .should('exist')
        .invoke('text')
        .should('not.be.empty');
    });

    it('logs out and returns to login page', () => {
      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      verifyLoginSucceeded();
      cy.get('.oxd-userdropdown-tab').click();
      cy.contains('Logout').click();
      cy.url({ timeout: 20000 }).should('include', '/auth/login');
    });
  });

  // ----------------------------------------------------------
  // 2. INVALID CREDENTIALS
  // ----------------------------------------------------------
  describe('2. Invalid Credentials', () => {
    beforeEach(() => visitLogin());

    it('rejects invalid username', () => {
      fillLogin('wronguser', VALID_PASS);
      submitLogin();
      cy.contains('Invalid credentials', { timeout: 10000 }).should('be.visible');
    });

    it('rejects invalid password', () => {
      fillLogin(VALID_USER, 'wrongpass');
      submitLogin();
      cy.contains('Invalid credentials', { timeout: 10000 }).should('be.visible');
    });

    it('rejects both invalid', () => {
      fillLogin('wronguser', 'wrongpass');
      submitLogin();
      cy.contains('Invalid credentials', { timeout: 10000 }).should('be.visible');
    });

    it('rejects empty username', () => {
      fillLogin('', VALID_PASS);
      submitLogin();
      cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });

    it('rejects empty password', () => {
      fillLogin(VALID_USER, '');
      submitLogin();
      cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('have.length.greaterThan', 0);
    });

    it('rejects both fields empty', () => {
      submitLogin();
      cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('have.length.greaterThan', 1);
    });
  });

  // ----------------------------------------------------------
  // 3. INPUT EDGE CASES
  // ----------------------------------------------------------
  describe('3. Input Edge Cases', () => {
    beforeEach(() => visitLogin());

    it('handles whitespace-only username', () => {
      fillLogin('   ', VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });

    it('handles whitespace-only password', () => {
      fillLogin(VALID_USER, '   ');
      submitLogin();
      verifyLoginRejected();
    });

    it('handles both fields whitespace-only', () => {
      fillLogin('   ', '   ');
      submitLogin();
      verifyLoginRejected();
    });

    it('handles username with trailing space', () => {
      fillLogin('Admin ', VALID_PASS);
      submitLogin();
      cy.get('body').should('be.visible');
    });

    it('handles username with leading space', () => {
      fillLogin(' Admin', VALID_PASS);
      submitLogin();
      cy.get('body').should('be.visible');
    });

    it('handles very long username (300 chars)', () => {
      fillLogin('a'.repeat(300), VALID_PASS);
      submitLogin();
      cy.get('body').should('be.visible');
    });

    it('handles very long password (500 chars)', () => {
      fillLogin(VALID_USER, 'p'.repeat(500));
      submitLogin();
      cy.get('body').should('be.visible');
    });

    it('handles special characters in username', () => {
      fillLogin('!@#$%^&*()', VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });

    it('handles unicode username', () => {
      fillLogin('अयेशा', VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });

    it('handles emoji in username', () => {
      fillLogin('👤admin🔥', VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });
  });

  // ----------------------------------------------------------
  // 4. SECURITY / INJECTION
  // ----------------------------------------------------------
  describe('4. Security - Injection Attacks', () => {
    beforeEach(() => visitLogin());

    it('blocks SQL injection (OR 1=1)', () => {
      fillLogin("' OR '1'='1", VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });

    it('blocks SQL injection (DROP TABLE)', () => {
      fillLogin("admin'; DROP TABLE users; --", VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });

    it('blocks SQL injection in password', () => {
      fillLogin(VALID_USER, "' OR '1'='1");
      submitLogin();
      verifyLoginRejected();
    });

    it('blocks XSS in username', () => {
      fillLogin('<script>alert("XSS")</script>', VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });

    it('blocks HTML injection', () => {
      fillLogin('<img src=x onerror=alert(1)>', VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });

    it('blocks command injection', () => {
      fillLogin('admin; cat /etc/passwd', VALID_PASS);
      submitLogin();
      verifyLoginRejected();
    });
  });

  // ----------------------------------------------------------
  // 5. CASE HANDLING
  // ----------------------------------------------------------
  describe('5. Case Handling', () => {
    beforeEach(() => visitLogin());

    it('documents case-insensitivity: lowercase "admin" logs in', () => {
      fillLogin('admin', VALID_PASS);
      submitLogin();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });

    it('documents case-insensitivity: uppercase "ADMIN" logs in', () => {
      fillLogin('ADMIN', VALID_PASS);
      submitLogin();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });

    it('documents case-insensitivity: mixed case "AdMiN" logs in', () => {
      fillLogin('AdMiN', VALID_PASS);
      submitLogin();
      cy.url({ timeout: 15000 }).should('include', '/dashboard');
    });

    it('password remains case-sensitive: "Admin123" should fail', () => {
      fillLogin(VALID_USER, 'Admin123');
      submitLogin();
      verifyLoginRejected();
    });
  });

  // ----------------------------------------------------------
  // 6. SESSION MANAGEMENT
  // ----------------------------------------------------------
  describe('6. Session Management', () => {
    it('redirects to login when accessing dashboard without session', () => {
      cy.visit(DASHBOARD_URL);
      cy.url({ timeout: 20000 }).should('include', '/auth/login');
    });

    it('persists session after page reload', () => {
      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      verifyLoginSucceeded();
      cy.reload();
      cy.url({ timeout: 20000 }).should('include', '/dashboard');
    });

    it('clears session after logout', () => {
      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      verifyLoginSucceeded();
      cy.get('.oxd-userdropdown-tab').click();
      cy.contains('Logout').click();
      cy.url({ timeout: 20000 }).should('include', '/auth/login');
      cy.visit(DASHBOARD_URL);
      cy.url({ timeout: 20000 }).should('include', '/auth/login');
    });

    it('sets authentication cookies after login', () => {
      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      verifyLoginSucceeded();
      cy.getCookies().should('have.length.greaterThan', 0);
    });
  });

  // ----------------------------------------------------------
  // 7. UX BEHAVIOR
  // ----------------------------------------------------------
  describe('7. UX Behavior', () => {
    beforeEach(() => visitLogin());

    it('masks password input field', () => {
      cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    });

    it('submits form with Enter key', () => {
      fillLogin(VALID_USER, VALID_PASS);
      cy.get('input[name="password"]').type('{enter}');
      verifyLoginSucceeded();
    });

    it('focuses the password field when typing continues there', () => {
      cy.get('input[name="username"]').type(VALID_USER);
      cy.get('input[name="password"]').click().type(VALID_PASS);
      cy.get('input[name="password"]').should('have.value', VALID_PASS);
    });

    it('shows placeholder text in fields', () => {
      cy.get('input[name="username"]').should('have.attr', 'placeholder');
      cy.get('input[name="password"]').should('have.attr', 'placeholder');
    });
  });

  // ----------------------------------------------------------
  // 8. INTERACTION EDGE CASES
  // ----------------------------------------------------------
  describe('8. Interaction Edge Cases', () => {
    beforeEach(() => visitLogin());

    it('handles double-click on login button', () => {
      fillLogin(VALID_USER, VALID_PASS);
      cy.get('button[type="submit"]').dblclick();
      verifyLoginSucceeded();
    });

    it('handles submit before filling fields', () => {
      cy.get('button[type="submit"]').click();
      cy.get('.oxd-input-field-error-message', { timeout: 10000 }).should('exist');
    });
  });

  // ----------------------------------------------------------
  // 9. NETWORK RESILIENCE
  // ----------------------------------------------------------
  describe('9. Network Resilience', () => {
    it('handles slow login API response', () => {
      cy.intercept('POST', '**/auth/validate', (req) => {
        req.on('response', (res) => res.setDelay(3000));
      }).as('slowLogin');

      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      cy.wait('@slowLogin', { timeout: 30000 });
      cy.url({ timeout: 30000 }).should('include', '/dashboard');
    });
  });

  // ----------------------------------------------------------
  // 10. FORGOT PASSWORD FLOW (NEW)
  // ----------------------------------------------------------
  describe('10. Forgot Password Flow', () => {

    it('navigates to Forgot Password page from login', () => {
      visitLogin();
      cy.contains('Forgot your password?', { timeout: 20000 }).click();
      cy.url({ timeout: 20000 }).should('include', '/auth/requestPasswordResetCode');
      cy.contains('Reset Password', { timeout: 20000 }).should('be.visible');
    });

    it('shows validation on empty username in Forgot Password', () => {
      visitLogin();
      cy.contains('Forgot your password?', { timeout: 20000 }).click();
      cy.url({ timeout: 20000 }).should('include', '/auth/requestPasswordResetCode');

      cy.contains('button', 'Reset Password', { timeout: 20000 }).click();
      cy.contains('Required', { timeout: 20000 }).should('be.visible');
    });

    it('returns to login when Cancel is clicked on Forgot Password page', () => {
      visitLogin();
      cy.contains('Forgot your password?', { timeout: 20000 }).click();
      cy.url({ timeout: 20000 }).should('include', '/auth/requestPasswordResetCode');

      cy.contains('button', 'Cancel', { timeout: 20000 }).click();
      cy.url({ timeout: 20000 }).should('include', '/auth/login');
      cy.get('input[name="username"]', { timeout: 20000 }).should('be.visible');
    });
  });

  // ----------------------------------------------------------
  // 11. BROWSER NAVIGATION BEHAVIOR (NEW)
  // ----------------------------------------------------------
  describe('11. Browser Navigation Behavior', () => {

    it('does not restore session when navigating back after logout', () => {
      visitLogin();
      fillLogin(VALID_USER, VALID_PASS);
      submitLogin();
      verifyLoginSucceeded();

      cy.get('.oxd-userdropdown-tab').click();
      cy.contains('Logout').click();
      cy.url({ timeout: 20000 }).should('include', '/auth/login');

      cy.go('back');
      cy.wait(2000);

      cy.url({ timeout: 20000 }).should('include', '/auth/login');
    });
  });

});