import dsFixture from '../../cypress/fixtures/document_submissions/id.json';

describe('Accept and reject evidence', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('PATCH', '/api/evidence/document_submissions/123', (req) => {
      const body = { ...dsFixture, id: 123, state: req.body.state };
      req.reply((res) => {
        res.send(200, body);
      });
    }).as('updateDocumentState');

    cy.visit(`http://localhost:3000/dashboard/residents/1`);
    cy.injectAxe();
  });

  it('resident detail page has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('shows resident contact details and all evidence states', () => {
    cy.get('h1').should('contain', 'Firstname Surname');

    cy.get('h2').should('contain', 'To review');
    cy.get('h2').should('contain', 'Pending requests');
    cy.get('h2').should('contain', 'Reviewed');
  });

  it('document detail page has no detectable accessibility issues', () => {
    cy.get('a').contains('Foo').click();
    cy.contains('h1', 'Firstname SurnamePassport');
    cy.checkA11y();
  });

  it('lets you see a document detail page with accept/reject actions', () => {
    cy.get('a').contains('Foo').click();

    cy.contains('h1', 'Firstname SurnamePassport');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.get('h2').should('contain', 'Preview');
    cy.get('h2').should('contain', 'History');
  });

  it('can approve the document', () => {
    cy.get('a').contains('Foo').click();
    cy.contains('h1', 'Firstname SurnamePassport');
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
    cy.get('a').contains('Foo').click();
    cy.contains('h1', 'Firstname SurnamePassport');
    cy.get('button').contains('Request new file').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('h2').should('contain', 'Request a new file');

      cy.get('span').should('contain', 'For example, text not legible');

      //TODO: test submission here
    });
  });
});

export {};
