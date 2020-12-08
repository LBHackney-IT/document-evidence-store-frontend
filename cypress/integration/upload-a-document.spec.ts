describe('Can upload a document', () => {
  it('shows guidance', () => {
    cy.visit(`http://localhost:3000/resident/foo`);
    cy.get('h1').should('contain', 'You’ll need to photograph your documents');
    cy.get('a').contains('Continue').click();
  });

  it('lets you choose a file', () => {
    cy.get('h1').should('contain', 'Upload your documents');
    cy.get('input[type=file]').attachFile('example.png');
    cy.get('button').contains('Continue').click();
  });

  // For when we implement form submit handling

  // it("shows a confirmation", () => {
  //   cy.get('h1').should('contain', "We've recieved your documents");
  // });
});

export {};