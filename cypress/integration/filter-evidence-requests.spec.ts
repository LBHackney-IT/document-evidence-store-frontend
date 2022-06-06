describe('Can filter evidence requests', () => {
  beforeEach(() => {
    cy.login();

    cy.visit(`http://localhost:3000/teams/2/dashboard`);
  });

  it('Has no detectable accessibility issues', () => {
    cy.visit(`http://localhost:3000/teams/2/dashboard`);
    cy.injectAxe();

    cy.checkA11y();
  });

  it('User can filter evidence requests', () => {
    // cy.intercept('GET', '?team=Development+Housing+Team&state=1', {
    //     fixture: 'evidence_requests/get-to-review',
    //   }).as('filteredEvidenceRequests');

    cy.get('label')
      .contains('Display only residents with documents pending review')
      .click();

    //   cy.wait('@filteredEvidenceRequests')

    // cy.wait('@filteredEvidenceRequests').its('response.statusCode').should('eq', 200)

    //   .then((interception) => {
    //       assert.isNotNull(interception.response?.body, 'this is the response')
    //   })

    cy.get('tbody tr').should('have.length', 1);
  });
});

export {};
