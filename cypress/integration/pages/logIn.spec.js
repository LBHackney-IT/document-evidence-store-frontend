describe('Loads page', () => {
  it("has 'Please log in' heading", () => {
    cy.visit(`http://localhost:3000`);
    cy.get('h1').should('have.text', 'Please log in');
  });
});
