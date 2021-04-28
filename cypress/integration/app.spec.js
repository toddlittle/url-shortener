describe("Saving and loading a shortened URL", function () {
  it("errors on invalid URLs", () => {
    cy.visit("/");
    cy.get('.app-styles .app-form .app-button').should('be.disabled');
    cy.get('.app-styles .app-form .app-input').type('NOT_A_URL');
    cy.get('.app-styles .app-form .app-button').should('not.be.disabled');
    cy.get('.app-styles .app-form .app-button').click();
    cy.get('.app-styles .app-form .app-input').should('have.attr', 'placeholder', 'You must pass a valid url. ');
    cy.get('.app-styles .app-form .app-input').should('have.attr', 'value', '');
    cy.get('.app-styles .app-form .app-button').should('be.disabled');
  });

  it("succeeds on valid URLs", () => {
    cy.visit("/");
    cy.get('.app-styles .app-form .app-button').should('be.disabled');
    cy.get('.app-styles .app-form .app-input').type('https://www.facebook.com');
    cy.get('.app-styles .app-form .app-button').should('not.be.disabled');
    cy.get('.app-styles .app-form .app-button').click();
    cy.get('.app-styles .saved-hash').should('exist').then(hash => {
      cy.visit(`/${hash.text().trim()}`);
      cy.get('.app-styles .loading-message').should('exist');
      cy.get('.app-styles .warning-message').should('exist');
      cy.get('.app-styles .app-button').should('have.attr', 'data-attr-url', 'https://www.facebook.com');
    });
  });

  it("errors loading invalid hash", () => {
    cy.visit("/NOT_A_HASH");  
    cy.get('.app-styles .loading-message').should('exist');
    cy.get('.app-styles .error-message').should('exist');
  });
});
