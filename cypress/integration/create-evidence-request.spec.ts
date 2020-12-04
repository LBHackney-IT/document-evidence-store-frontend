describe('Can view evidence requests', () => {
  it("has 'Please log in' heading", () => {
    cy.visit(`http://localhost:3000`);

    cy.get('nav').contains('Requests').click();
    cy.get('h2').should('contain', 'Pending requests');

    cy.get('a').contains('New request').click();

    cy.get('h2').should('contain', 'Make a new request');

    cy.get('label').contains('Name').next('input').type('Frodo Baggins');
    cy.get('label').contains('Email').next('input').type('frodo@bagend.com');
    cy.get('label')
      .contains('Mobile phone number')
      .next('input')
      .type('+447123456780');

    cy.get('label').contains('Send request by SMS').click();
    cy.get('label').contains('Driving license').click();

    cy.get('button').contains('Send request').click();
  });
});

export {};
