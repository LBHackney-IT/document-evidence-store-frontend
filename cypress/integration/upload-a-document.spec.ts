import evidenceRequestsFixture from '../../cypress/fixtures/evidence_requests/id.json';
import dsFixture from '../../cypress/fixtures/document_submissions/create.json';
import teams from '../../teams.json';

describe('Can upload a document', () => {
  const requestId = 'foo';
  const residentReferenceId = evidenceRequestsFixture.residentReferenceId;

  beforeEach(() => {
    cy.intercept(
      'PATCH',
      /\/api\/evidence\/document_submissions\/.+/,
      (req) => {
        const response = dsFixture;

        req.responseTimeout = 5000;
        req.reply((res) => {
          res.send(200, response);
        });
      }
    ).as('patch-document-state');

    cy.visit(`http://localhost:3000/resident/${requestId}`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  context('when upload is successful', () => {
    beforeEach(() => {
      cy.intercept('POST', dsFixture.uploadPolicy.url, {
        statusCode: 201,
        delayMs: 2500,
      }).as('s3Upload');
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
      cy.wait('@patch-document-state');
      cy.wait('@patch-document-state');

      // View confirmation
      cy.get('h1').should('contain', "We've received your documents");
      cy.get('p').should(
        'contain',
        `Your reference number: ${residentReferenceId}`
      );
    });

    it('shows guidance and lets you upload multiple files for each document type', () => {
      // View guidance
      cy.get('h1').should(
        'contain',
        'You’ll need to photograph your documents'
      );
      cy.get('a').contains('Continue').click();

      // Attach a file
      cy.get('h1').should('contain', 'Upload your documents');
      cy.get('input[type=file]').each((input) => {
        cy.wrap(input).attachFile('example.png').attachFile('example.png');
      });
      cy.get('button').contains('Continue').click();

      cy.get('button').contains('Continue').should('have.attr', 'disabled');

      cy.wait('@s3Upload');
      cy.wait('@s3Upload');
      cy.wait('@s3Upload');
      cy.wait('@s3Upload');
      cy.wait('@patch-document-state');
      cy.wait('@patch-document-state');
      cy.wait('@patch-document-state');
      cy.wait('@patch-document-state');

      // View confirmation
      cy.get('h1').should('contain', "We've received your documents");
      cy.get('p').should(
        'contain',
        `Your reference number: ${residentReferenceId}`
      );
      cy.get('p').should('contain', `${teams[1].slaMessage}`);
    });
  });

  context('when upload is unsuccessful', () => {
    beforeEach(() => {
      cy.intercept('POST', dsFixture.uploadPolicy.url, {
        forceNetworkError: true,
      }).as('s3Upload');
    });

    it('shows an error message', () => {
      cy.get('a').contains('Continue').click();

      cy.get('input[type=file]').each((input) =>
        cy.wrap(input).attachFile('example.png')
      );
      cy.get('button').contains('Continue').click();

      // View error message
      cy.get('span').should(
        'contain',
        'There was an error. Please try again later'
      );
    });
  });
});
