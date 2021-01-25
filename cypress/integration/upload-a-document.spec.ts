import dsFixtures from '../fixtures/document-submission-response.json';

describe('Can upload a document', () => {
  const requestId = 'foo';

  beforeEach(() => {
    cy.intercept('/api/evidence/document_types', {
      fixture: 'document-types-response.json',
    });
    cy.intercept('GET', `/api/evidence/evidence_requests/${requestId}`, {
      fixture: 'evidence-request-response-singular',
    });
    cy.intercept('POST', '/api/evidence/document_submissions', (req) => {
      const docType = req.body.documentType;
      const response = dsFixtures.find((ds) => ds.documentType.id === docType);
      req.reply((res) => {
        res.send(201, response);
      });
    }).as('s3Upload');

    cy.visit(`http://localhost:3000/resident/${requestId}`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  context('when upload is successful', () => {
    beforeEach(() => {
      cy.intercept('POST', dsFixtures[0].uploadPolicy.url, {
        statusCode: 201,
        delayMs: 2500,
      });
    });

    it('shows guidance and lets you upload a file', () => {
      // View guidance
      cy.get('h1').should(
        'contain',
        'You’ll need to photograph your documents'
      );
      cy.get('a').contains('Continue').click();

      // Attach a file
      cy.get('h1').should('contain', 'Upload your documents');
      cy.get('input[type=file]').each((input) =>
        cy.wrap(input).attachFile('example.png')
      );
      cy.get('button').contains('Continue').click();

      cy.get('button').contains('Continue').should('have.attr', 'disabled');
      cy.wait('@s3Upload');
      cy.wait('@s3Upload');

      // View confirmation
      cy.get('h1').should('contain', "We've recieved your documents");
      cy.get('p').should('contain', `Your reference number: ${requestId}`);
    });
  });

  context('when upload is unsuccessful', () => {
    beforeEach(() => {
      cy.intercept('POST', dsFixtures[0].uploadPolicy.url, {
        forceNetworkError: true,
      });
    });

    it('shows guidance and lets you upload a file', () => {
      cy.get('a').contains('Continue').click();

      cy.get('input[type=file]').each((input) =>
        cy.wrap(input).attachFile('example.png')
      );
      cy.get('button').contains('Continue').click();

      cy.wait('@s3Upload');

      // View error message
      cy.get('span').should(
        'contain',
        'There was an error. Please try again later'
      );
    });
  });
});
