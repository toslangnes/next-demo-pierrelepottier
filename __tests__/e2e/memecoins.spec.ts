describe('Memecoins List', () => {
  beforeEach(() => {
    cy.visit('/memecoins');
  });

  it('should display the memecoins list page', () => {
    // Given I am on the memecoins page
    // Then the page title should be visible
    cy.contains('h1', 'Explore Coins').should('be.visible');

    // And the create memecoin button should be visible
    cy.contains('Create Coin').should('be.visible');
  });

  it('should navigate to a memecoin detail page when clicking on a memecoin', () => {
    // Given the memecoins are loaded
    cy.get('h3').first().should('be.visible');

    // When I click on the first memecoin
    cy.get('h3').first().invoke('text').then((text) => {
      cy.get('h3').first().click();

      // Then I should be on the detail page
      cy.url().should('include', '/memecoins/');

      // And the memecoin name should be displayed
      cy.contains(text).should('be.visible');
    });
  });

  it('should filter memecoins when using the search bar', () => {
    // Given the memecoins are loaded
    cy.get('h3').first().should('be.visible');

    // When I search for a memecoin
    cy.get('input[placeholder*="Rechercher"]').type('a');

    // Then the search results should update
    cy.wait(500);

    // And the URL should contain the search parameter
    cy.url().should('include', 'q=a');

    // And the search results should be displayed
    cy.get('h3').should('exist');
  });
});
