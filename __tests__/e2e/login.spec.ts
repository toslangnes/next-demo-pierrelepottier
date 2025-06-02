describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login');
  });

  it('should display the login page correctly', () => {
    // Given I am on the login page
    // Then the page title should be visible
    cy.contains('Login').should('be.visible');

    // And the form elements should be visible
    cy.get('input[id="email"]').should('be.visible');
    cy.get('input[id="password"]').should('be.visible');
    cy.contains('button', 'Login').should('be.visible');
  });

  it('should show validation errors for invalid inputs', () => {
    // Given I am on the login page
    // When I submit the form with invalid data
    cy.get('input[id="email"]').type('invalid-email');
    cy.contains('button', 'Login').click();

    // Then I should see validation errors
    cy.contains('Invalid email format').should('be.visible');
  });

  it('should show error message for incorrect credentials', () => {
    // Given I am on the login page
    // When I enter incorrect credentials and submit
    cy.get('input[id="email"]').type('nonexistent@example.com');
    cy.get('input[id="password"]').type('wrongpassword');
    cy.contains('button', 'Login').click();

    // Then I should see an error message
    // Add a longer wait to allow time for the API call to complete
    cy.wait(2000); // Wait for 2 seconds
    // Use a more robust way to check for the error message
    cy.get('.text-red-500').contains('Invalid email or password').should('be.visible');
  });

  it('should navigate to signup page when clicking the signup link', () => {
    // Given I am on the login page
    // When I click on the signup link
    cy.contains('Sign up').click();

    // Then I should be redirected to the signup page
    cy.url().should('include', '/signup');
  });

  it('should successfully login with valid credentials', () => {
    // Given I am on the login page
    // And I intercept the login API call to mock a successful response
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: { success: true }
    }).as('loginRequest');

    // When I enter valid credentials and submit
    cy.get('input[id="email"]').type('test@example.com');
    cy.get('input[id="password"]').type('password123');
    cy.contains('button', 'Login').click();

    // Then the login request should be made
    cy.wait('@loginRequest');

    // And I should be redirected to the home page
    cy.url().should('eq', Cypress.config().baseUrl + '/');
  });
});
