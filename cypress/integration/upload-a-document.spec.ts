describe('Can upload a document', () => {
  beforeEach(() => {
    cy.intercept('/api/evidence/document_types', {
      fixture: 'document-types-response.json',
    });
    cy.intercept('GET', '/api/evidence/evidence_requests', {
      fixture: 'evidence-request-response',
    });
    cy.intercept('POST', '/api/evidence/evidence_request', {
      fixture: 'single-evidence-request-response',
    });

    cy.visit(`http://localhost:3000/resident/foo`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('shows guidance', () => {
    cy.get('h1').should('contain', 'You’ll need to photograph your documents');
    cy.get('a').contains('Continue').click();
  });

  it('lets you choose a file', () => {
    cy.get('a').contains('Continue').click();
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
