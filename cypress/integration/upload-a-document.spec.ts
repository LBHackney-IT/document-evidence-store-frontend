import evidenceRequestsFixture from '../../cypress/fixtures/evidence_requests/id.json';
import dsFixture from '../../cypress/fixtures/document_submissions/create.json';
import teams from '../../teams.json';

describe('Can upload a document', () => {
  const requestId = 'foo';
  const residentReferenceId = evidenceRequestsFixture.resident.referenceId;

  beforeEach(() => {
    cy.visit(`http://localhost:3000/resident/${requestId}`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  context('when upload is successful', () => {
    beforeEach(() => {
      cy.intercept('POST', /\/api\/evidence\/evidence_requests\/.+/, (req) => {
        const response = dsFixture;

        req.responseTimeout = 5000;
        req.reply((res) => {
          res.delay(2500);
          res.send(200, response);
        });
      }).as('post-document-state');

      cy.intercept('POST', dsFixture.uploadPolicy.url, {
        statusCode: 201,
        delayMs: 2500,
      }).as('s3Upload');
    });

    it('shows landing message, check guidance and lets you upload a file', () => {
      // View landing message
      cy.get('h1').should('contain', 'Please have your documents ready');
      cy.get('p').should('contain', `${teams[1].landingMessage}`);
      cy.get('a').contains('Continue').click();

      // Check guidance
      cy.get('h1').should('contain', 'Upload your documents');

      cy.get('[data-testid=photo-info-details-title]')
        .should('contain', 'How to photograph your documents')
        .click();
      cy.get('[data-testid=photo-info-details-text]').should(
        'contain',
        'You can use your smartphone camera. First, make sure you’re in a well-lit place.'
      );
      cy.get('[data-testid=file-formats-details-title]')
        .should('contain', 'Which file formats are accepted?')
        .click();
      cy.get('[data-testid=file-formats-details-text]').should(
        'contain',
        'We currently support the following formats:'
      );
      cy.get('[data-testid=select-multiple-files-guidance]').should(
        'contain',
        `After clicking the "Choose files" button, you can use the Ctrl key (Command key on a Mac machine) + click to select multiple files.`
      );

      //Attach a file
      cy.get('input[type=file]').each((input) =>
        cy.wrap(input).attachFile('example.png')
      );
      cy.get('button').contains('Continue').click();

      cy.get('button').contains('Continue').should('have.attr', 'disabled');

      cy.wait('@post-document-state');
      cy.wait('@s3Upload');

      // View confirmation
      cy.get('h1').should('contain', "We've received your documents");
      cy.get('p').should(
        'contain',
        `Your reference number: ${residentReferenceId}`
      );
      cy.get('p').should('contain', `${teams[1].slaMessage}`);
    });

    it('shows landing message, view guidance and lets you upload multiple files for each document type', () => {
      // View landing message
      cy.get('h1').should('contain', 'Please have your documents ready');
      cy.get('p').should('contain', `${teams[1].landingMessage}`);
      cy.get('a').contains('Continue').click();

      // View guidance
      cy.get('h1').should('contain', 'Upload your documents');
      cy.get('[data-testid=photo-info-details-title]').should(
        'contain',
        'How to photograph your documents'
      );
      cy.get('[data-testid=file-formats-details-title]').should(
        'contain',
        'Which file formats are accepted?'
      );
      cy.get('[data-testid=select-multiple-files-guidance]').should(
        'contain',
        `After clicking the "Choose files" button, you can use the Ctrl key (Command key on a Mac machine) + click to select multiple files.`
      );

      //Attach a file
      cy.get('input[type=file]').each((input) => {
        cy.wrap(input).attachFile('example.png').attachFile('example.png');
      });
      cy.get('button').contains('Continue').click();

      cy.get('button').contains('Continue').should('have.attr', 'disabled');

      cy.wait('@post-document-state');
      cy.wait('@s3Upload');
      cy.wait('@post-document-state');
      cy.wait('@s3Upload');
      cy.wait('@post-document-state');
      cy.wait('@s3Upload');
      cy.wait('@post-document-state');
      cy.wait('@s3Upload');

      // View confirmation
      cy.get('h1').should('contain', "We've received your documents");
      cy.get('p').should(
        'contain',
        `Your reference number: ${residentReferenceId}`
      );
      cy.get('p').should('contain', `${teams[1].slaMessage}`);
    });
  });

  it('clears the selected files for upload', () => {
    cy.get('a').contains('Continue').click();
    cy.get('input[type=file]').each((input) => {
      cy.wrap(input).attachFile('example.png').attachFile('example.png');
    });
    cy.get('button').eq(0).contains('Clear selection').click();
    cy.get('input[type=file]').eq(0).should('be.empty');
    cy.get('input[type=file]')
      .eq(1)
      .should('have.value', `C:\\fakepath\\example.png`);
  });

  context('when upload is unsuccessful', () => {
    beforeEach(() => {
      cy.intercept('POST', /\/api\/evidence\/evidence_requests\/.+/, (req) => {
        const response = dsFixture;

        req.responseTimeout = 5000;
        req.reply((res) => {
          res.send(500, response);
        });
      }).as('post-document-state');

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
