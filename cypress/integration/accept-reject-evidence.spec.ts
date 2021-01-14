describe('Accept and reject evidence', () => {
  beforeEach(() => {
    cy.login();

    cy.visit(`http://localhost:3000/dashboard/resident/1`);
  });

  it('shows resident contact details and all evidence states', () => {
    cy.get('h2').should('contain', 'Firstname Surname');

    cy.get('h3').should('contain', 'To review');
    cy.get('h3').should('contain', 'Pending requests');
    cy.get('h3').should('contain', 'Reviewed');
  });

  it('lets you see a document detail page with accept/reject actions', () => {
    cy.get('a').contains('Foo').click();

    cy.get('h2').should('contain', 'Passport');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.get('h3').should('contain', 'Preview');
    cy.get('h3').should('contain', 'History');
  });

  it('launches accept dialog', () => {
    cy.get('a').contains('Foo').click();
    cy.get('a').contains('Accept').click();

    cy.get('h2').should(
      'contain',
      'Are you sure you want to accept this file?'
    );
  });

  it('launches reject dialog', () => {
    cy.get('a').contains('Foo').click();
    cy.get('a').contains('Request new file').click();

    cy.get('h2').should('contain', 'Request a new file');
  });

  it('demands a reason for rejection', () => {
    cy.get('a').contains('Foo').click();
    cy.get('a').contains('Request new file').click();

    cy.get('button').contains('Request new file').click();

    cy.get('span').should('contain', 'Please give a reason');
  });
});

export {};
