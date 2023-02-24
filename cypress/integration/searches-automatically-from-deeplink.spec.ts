describe('Can search for a resident', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/residents/search', {
      fixture: 'residents/search',
    });

    cy.intercept('/api/evidence/residents/update-group-id', {
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

  it('Shows a confirmation dialog before linking residents', () => {
    cy.get('h2').should('contain', 'Found results');

    cy.get('tbody tr').should('have.length', 3);

    cy.get('tbody tr:first')
      .get('td > a')
      .eq(0)
      .click()
      .get('button')
      .contains('Yes, link residents');
  });

  it("Shows a confirmation dialog and confirming link sends the user on that resident's page", () => {
    cy.get('h2').should('contain', 'Found results');

    cy.get('tbody tr').should('have.length', 3);

    cy.get('tbody tr:first')
      .get('td > a')
      .eq(0)
      .click()
      .get('button')
      .contains('Yes, link residents')
      .click();
    cy.get('h1').should('contain', 'Namey McName');
  });

  it('Shows a confirmation dialog and can cancel it', () => {
    cy.get('h2').should('contain', 'Found results');

    cy.get('tbody tr').should('have.length', 3);

    cy.get('tbody tr:first')
      .get('td > a')
      .eq(0)
      .click()
      .get('button')
      .contains('No, cancel')
      .click();
    cy.get('h1').should('contain', 'Link Resident');
  });
});

export {};
