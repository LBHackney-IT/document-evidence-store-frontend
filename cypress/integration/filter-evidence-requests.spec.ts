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
    cy.intercept('GET', '?team=Development+Housing+Team&state=1', {
      fixture: 'evidence_requests/get-to-review',
    }).as('filteredEvidenceRequests');

    cy.get('label')
      .contains('Display only residents with documents pending review')
      .click();

    cy.wait('@filteredEvidenceRequests').then((interception) => {
      assert.include(
        interception.request?.url,
        '?team=Development+Housing+Team&state=1'
      );
      assert.equal(interception.response?.statusCode, 200);
      assert.isNotNull(interception.response?.body);
    });

    cy.get('tbody tr').should('have.length', 1);
  });
});
