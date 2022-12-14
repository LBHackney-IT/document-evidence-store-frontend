describe('Can add a resident to the DES database', () => {
  context('when resident doesn not exist', () => {
    beforeEach(() => {
      cy.login();

      cy.intercept('POST', '/api/evidence/residents', {
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

      cy.get('.govuk-button').first().click();

      //assert here?
    });
  });

  context('when resident already exists', () => {
    beforeEach(() => {
      cy.login();

      cy.intercept('POST', '/api/evidence/residents', (req) => {
        req.responseTimeout = 5000;
        req.reply((res) => {
          res.send(400, 'The resident already exists in the system');
        });
      }).as('duplicateResident');

      cy.visit(`http://localhost:3000/teams/2/dashboard/residents/create`);
      cy.injectAxe();
    });

    it('shows an error message', () => {
      cy.get('#name').type('Namey McName');
      cy.get('#email').type('frodo@bagend.com');
      cy.get('#phoneNumber').type('+447123456780');

      cy.get('.govuk-button').first().click();
      cy.wait('@duplicateResident');

      cy.get('span').should(
        'contain',
        'The resident already exists in the system'
      );
    });
  });
});

export {};
