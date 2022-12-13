describe('Can add a resident to the DES database', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/residents', {
      fixture: 'residents/create',
    });

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
});

export {};
