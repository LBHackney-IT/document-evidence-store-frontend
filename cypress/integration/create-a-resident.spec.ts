describe('Can add a resident to the DES database', () => {
  beforeEach(() => {
    cy.login();

    cy.visit(`http://localhost:3000/teams/2/dashboard/residents/create`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });
});

export {};
