describe('View evidence requests', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/evidence_requests', {
      fixture: 'evidence_requests/index',
    });

    cy.visit(`http://localhost:3000/teams/2/dashboard`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('User can view pending evidence requests', () => {
    cy.get('nav').contains('Requests').click();

    cy.get('h1').should('contain', 'Pending requests');

    cy.get('tbody tr').should('have.length', 3);

    cy.get('tbody tr:first')
      .should('contain', 'Namey McName')
      .and('contain', 'Passport')
      .and('contain', 'ago')
      .and('contain', 'test@hackney.gov.uk');
  });
});

export {};
