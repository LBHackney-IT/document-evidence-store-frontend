describe('Can view evidence requests', () => {
  beforeEach(() => {
    cy.login();
    cy.intercept('/api/evidence/evidence_requests', {
      fixture: 'evidence-request-response',
    });
  });

  it("has 'Please log in' heading", () => {
    cy.visit(`http://localhost:3000`);
    cy.get('nav').contains('Requests').click();

    cy.get('h2').should('contain', 'Pending requests');
    cy.contains('Loading').should('exist');

    cy.get('tbody tr')
      .should('have.length', 3)
      .first()
      .should('contain', 'Namey McName')
      .and('contain', 'Passport')
      .and('contain', 'days ago');
  });
});

export {};
