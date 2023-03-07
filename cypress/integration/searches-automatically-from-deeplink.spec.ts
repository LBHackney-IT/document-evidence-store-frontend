describe('Can search for a resident', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/residents/search', {
      fixture: 'residents/search',
    });

    cy.intercept('POST', '/api/evidence/residents/merge-and-link', {
      fixture: 'residents/merge-and-link',
    });

    cy.visit(
      `http://localhost:3000/teams/2/dashboard/deeplink?searchTerm=Namey&groupId=41b32531-7973-487a-8f6d-74d31cfd2181&name=Test%20Resident&phone=07000&email=testy@test.com`
    );
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y({
      exclude: ['input'],
    });
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

    cy.get('[data-testid="link-residents-button"]')
      .contains('Link residents')
      .click()
      .get('button')
      .contains('Yes, link residents')
      .get('button')
      .contains('No, cancel');
  });

  it("Shows a confirmation dialog and confirming link sends the user on that resident's page", () => {
    cy.get('h2').should('contain', 'Found results');

    cy.get('tbody tr').should('have.length', 3);
    cy.get('tbody').scrollIntoView();

    cy.get('[data-testid="link-resident-summary-tr-0"]')
      .click()
      .get('[data-testid="link-resident-summary-tr-1"]')
      .click();

    cy.get('[data-testid="link-residents-button"]')
      .contains('Link residents')
      .click()
      .get('button')
      .contains('Yes, link residents')
      .click();
    cy.get('h1').should('contain', 'Namey McName');
  });

  it('Shows a confirmation dialog and can cancel it', () => {
    cy.get('h2').should('contain', 'Found results');

    cy.get('tbody tr').should('have.length', 3);

    cy.get('[data-testid="link-residents-button"]')
      .contains('Link residents')
      .click()
      .get('button')
      .contains('No, cancel')
      .click();
    cy.get('h1').should('contain', 'Link Resident');
  });
});

export {};
