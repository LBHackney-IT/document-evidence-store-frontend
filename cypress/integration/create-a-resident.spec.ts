describe('Can add a resident to the DES database', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('POST', '/api/residents', {
      fixture: 'residents/create',
    }).as('createResident');

    cy.visit(`http://localhost:3000/teams/2/dashboard/residents/create`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('User can add a resident', () => {
    cy.get('#name').type('Test Resident');
    cy.get('#email').type('test@test.com');
    cy.get('#phoneNumber').type('1-800-543-2342');

    cy.get('.govuk-button').click();
  });

  context('when resident already exists', () => {
    beforeEach(() => {
      cy.intercept('POST', '/api/residents', (req) => {
        req.reply((res) => {
          res.send(400, 'The resident already exists in the system');
        });
      });
    });

    it('shows an error message', () => {
      cy.get('#name').type('Test Resident');
      cy.get('#email').type('test@test.com');
      cy.get('#phoneNumber').type('1-800-543-2342');

      cy.get('.govuk-button').click();

      cy.get('span').should(
        'contain',
        'There was an error. Please try again later'
      );
    });
  });
});

export {};
