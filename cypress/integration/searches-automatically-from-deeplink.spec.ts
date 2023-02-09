describe('Can search for a resident', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/residents/search', {
      fixture: 'residents/search',
    });

    cy.visit(
      `http://localhost:3000/teams/2/dashboard/deeplink?searchTerm=Namey`
    );
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('Automatically performs resident search from deeplink search term', () => {
    cy.get('h2').should('contain', 'Found results');

    cy.get('tbody tr').should('have.length', 3);

    cy.get('tbody tr:first')
      .should('contain', 'Namey McName')
      .and('contain', 'frodo');
  });
});

export {};
