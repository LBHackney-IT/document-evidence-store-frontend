describe('Can search for a resident', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/evidence_requests', {
      fixture: 'evidence_requests/index',
    });

    cy.intercept('/api/evidence/residents/search', {
      fixture: 'residents/search',
    });

    cy.visit(`http://localhost:3000/dashboard`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('User can search for a resident', () => {
    cy.get('#search-query').type('Namey');

    cy.get('.govuk-button').click();

    cy.get('h2').should('contain', 'Search results');

    cy.get('tbody tr').should('have.length', 9);

    cy.get('tbody tr:first')
      .should('contain', 'Namey McName')
      .and('contain', 'frodo');
  });
});

export {};
