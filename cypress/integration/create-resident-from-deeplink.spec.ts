describe('Can allow a user to create a resident from the deeplink, prefilling the information', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/residents/search', {
      fixture: 'residents/emptySearch',
    });

    cy.visit(
      `http://localhost:3000/teams/2/dashboard/deeplink?searchTerm=testUser&groupId=b4700106-f415-4209-9fd7-f707d9ba5432&name=Test%20User&phone=07975493012`
    );
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('User can navigate to the create resident page, and the data is prefilled', () => {
    cy.get('.govuk-button').contains('Create New').click();
    cy.get('#name').should('have.value', 'Test User');
    cy.get('#phoneNumber').should('have.value', '07975493012');
  });
});

export {};
