describe('Can search for a resident', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/residents/search', {
      fixture: 'residents/linkedResident',
    });
    cy.visit(
      `http://localhost:3000/teams/2/dashboard/deeplink?searchTerm=test&groupId=527f152e-4f40-4c5a-bcc2-a78d9eb5cd8a`
    );
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('Deeplinks directly to resident page if group id found', () => {
    cy.get('h1').should('contain', 'Namey McName');
    cy.get('h2').should('contain', 'All documents');
    cy.get('section[id="all-documents"] table')
      .eq(0)
      .should('contain', 'PENDING REVIEW')
      .and('contain.text', 'Proof of ID(PNG 24.7 KB)')
      .and(
        'contain.text',
        'Date uploaded: 10:23 am 14 January 2021 (4 years ago)'
      )
      .and('contain.text', 'reason number 1')
      .and('contain.text', 'Requested by test1@hackney.gov.uk');

    cy.get('section[id="all-documents"] table')
      .eq(3)
      .should('contain', 'APPROVED')
      .and('contain.text', 'Passport(PNG 24.7 KB)')
      .and(
        'contain.text',
        'Date uploaded: 10:23 am 25 December 2020 (5 years ago)'
      )
      .and('contain.text', 'reason number 1')
      .and('contain.text', 'Requested by test1@hackney.gov.uk');

    cy.get('section[id="all-documents"] table')
      .eq(4)
      .should('contain', 'REJECTED')
      .and('contain.text', 'Proof of ID(PNG 24.7 KB)')
      .and(
        'contain.text',
        'Date uploaded: 10:23 am 30 December 2020 (5 years ago)'
      )
      .and('contain.text', 'reason number 2')
      .and('contain.text', 'Requested by test2@hackney.gov.uk');

    cy.get('section[id="all-documents"] table').should('have.length', 6);
  });
});

export {};
