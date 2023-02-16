describe('Can add a resident to the DES database, prefilling the data from the deeplink', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('POST', '/api/evidence/residents', {
      fixture: 'residents/create',
    }).as('createResident');

    cy.visit(
      `http://localhost:3000/teams/2/dashboard/residents/create??name=Test%20User&groupId=b4700106-f415-4209-9fd7-f707d9ba5432&phone=07975493012`
    );
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('User can add a resident, with the data already prefilled', () => {
    cy.get('#name').should('contain', 'Test User');
    cy.get('#phoneNumber').should('contain', '07975493012');
    cy.get('.govuk-button').first().click();
  });
});

export {};
