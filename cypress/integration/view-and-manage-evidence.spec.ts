import dsFixture from '../../cypress/fixtures/document_submissions/get-png.json';

describe('Can view and manage evidence', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('PATCH', '/api/evidence/document_submissions', (req) => {
      const body = { ...dsFixture, id: 123, state: req.body.state };
      req.reply((res) => {
        res.send(200, body);
      });
    }).as('updateDocumentState');

    cy.visit(`http://localhost:3000/teams/2/dashboard`);
    cy.injectAxe();

    cy.get('a').contains('Namey McName').click();
    cy.contains('h1', 'Namey McName');
  });

  it('pages have no detectable accessibility issues', () => {
    cy.checkA11y();
    cy.get('a').contains('Passport').click();
    cy.contains('h1', 'Namey McNamePassport');
    cy.checkA11y();
  });

  it('shows resident contact details and all evidence states', () => {
    cy.get('h1').should('contain', 'Namey McName');

    cy.get('h2').should('contain', 'To review');
    // cy.get('h2').should('contain', 'Pending requests');
    cy.get('h2').should('contain', 'Reviewed');
  });

  it('lets you see an image document detail page with actions and information', () => {
    cy.get('.toReview a').eq(0).contains('Passport').click();

    cy.contains('h1', 'Namey McNamePassport');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.get('h2').should('contain', 'Preview');
    cy.get('img').should('be.visible');

    cy.get('figure').should('contain', 'PNG');
    cy.get('figure').should('contain', '24.7 KB');
    cy.get('button').should('contain', 'Download');

    // TODO: uncomment when History is implemented
    // cy.get('h2').should('contain', 'History');
  });

  it('lets you see an PDF document detail page with actions and information', () => {
    cy.get('.toReview a').eq(3).contains('Passport').click();

    cy.contains('h1', 'Namey McNamePassport');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.contains('PDF');
    cy.contains('54.0 KB');
    cy.get('button').should('contain', 'Download');

    // TODO: uncomment when History is implemented
    // cy.get('h2').should('contain', 'History');
  });

  it('can approve the document', () => {
    cy.get('a').contains('Passport').click();
    cy.contains('h1', 'Namey McNamePassport');
    cy.get('button').contains('Accept').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('h2').should(
        'contain',
        'Are you sure you want to accept this file?'
      );

      cy.get('button').contains('Yes, accept').click();

      cy.get('@updateDocumentState').its('request.body').should('deep.equal', {
        state: 'APPROVED',
      });
    });

    cy.get('[role=dialog]').should('not.exist');
    cy.contains('button', 'Accept').should('not.exist');
    cy.contains('button', 'Request new file').should('not.exist');
  });

  it('can reject the document', () => {
    cy.get('a').contains('Passport').click();
    cy.contains('h1', 'Namey McNamePassport');
    cy.get('button').contains('Request new file').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('h2').should('contain', 'Request a new file');

      cy.get('span').should('contain', 'For example, text not legible');

      //TODO: test submission here
    });
  });
});

export {};
