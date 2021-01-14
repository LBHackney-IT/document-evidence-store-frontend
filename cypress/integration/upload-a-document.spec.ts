describe('Can upload a document', () => {
  beforeEach(() => {
    cy.intercept('/api/evidence/document_types', {
      fixture: 'document-types-response.json',
    });
    cy.intercept('GET', '/api/evidence/evidence_requests/foo', {
      fixture: 'evidence-request-response-singular',
    });
    cy.intercept('POST', '/api/evidence/document_submissions', {
      fixture: 'document-submission-response-singular',
      statusCode: 201,
    });

    cy.visit(`http://localhost:3000/resident/foo`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });


  it('shows guidance and lets you upload a file', () => {
    // View guidance
    cy.get('h1').should('contain', 'You’ll need to photograph your documents');
    cy.get('a').contains('Continue').click();

    // Attach a file
    cy.get('h1').should('contain', 'Upload your documents');
    cy.get('input[type=file]').attachFile('example.png');
    cy.get('button').contains('Continue').click();
  });
});

export {};
