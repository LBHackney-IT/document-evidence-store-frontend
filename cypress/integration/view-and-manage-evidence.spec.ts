import dsFixture from '../../cypress/fixtures/document_submissions/get-pdf.json';
import dsFixtureHeic from '../../cypress/fixtures/document_submissions/get-heic.json';
describe('Can view and manage evidence', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('PATCH', '/api/evidence/document_submissions', (req) => {
      const body = {
        ...dsFixture,
        id: 123,
        state: req.body.state,
        staffSelectedDocumentTypeId: req.body.staffSelectedDocumentTypeId,
      };
      console.log(body);
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
    cy.get('a').contains('Proof of ID').click();
    cy.contains('h1', 'Namey McNameProof of ID');
    cy.checkA11y();
  });

  it('shows resident contact details and document submissions in all states', () => {
    cy.get('h1').should('contain', 'Namey McName');
    cy.get('.toReview a').eq(0).contains('Proof of ID');

    cy.get('h2').should('contain', 'Pending review');
    cy.get('h2').should('contain', 'Reviewed');
    cy.get('.reviewed a').eq(0).should('contain', 'Proof of ID');
    cy.get('h2').should('contain', 'Rejected');
    cy.get('.rejected a').eq(0).should('contain', 'Proof of ID');
  });

  it('shows the correct date format', () => {
    cy.get('.toReview').should(
      'contain',
      '10:23 am 14 January 2021 (last year)'
    );
    cy.get('.reviewed').should(
      'contain',
      '10:23 am 25 December 2020 (2 years ago)'
    );
    cy.get('.rejected').should(
      'contain',
      '10:23 am 30 December 2020 (2 years ago)'
    );
  });

  it('lets you see an image document detail page with actions and information', () => {
    cy.get('.toReview a').eq(0).contains('Proof of ID').click();

    cy.contains('h1', 'Namey McNameProof of ID');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.get('h2').should('contain', 'Preview');
    cy.get('img').should('be.visible');

    cy.get('figure').should('contain', 'PNG');
    cy.get('figure').should('contain', '24.7 KB');
    // cy.get('a').should('contain', 'Open in new tab').and('have.attr', 'href');

    cy.get('h2').should('contain', 'History');
    cy.get('table')
      .should('contain', 'Valid until')
      .and('contain', '29 January 2121')
      .and('contain', 'Retention expires')
      .and('contain', '14 April 2021');
  });

  it('lets you see an PDF document detail page with actions and information', () => {
    cy.get('.toReview a').eq(1).contains('Proof of ID').click();

    cy.contains('h1', 'Namey McNameProof of ID');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.get('h2').should('contain', 'Preview');
    cy.get('iframe');

    cy.contains('PDF');
    cy.contains('54.0 KB');
    // cy.get('a').should('contain', 'Open in new tab').and('have.attr', 'href');
  });

  it('can approve the document', () => {
    cy.get('a').contains('Proof of ID').click();
    cy.contains('h1', 'Namey McNameProof of ID');
    cy.get('button').contains('Accept').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('h2').should(
        'contain',
        'Are you sure you want to accept this file?'
      );

      cy.get('#staffSelectedDocumentTypeId-passport-scan').click();

      cy.get('label').contains('Day').next('input').type('30');
      cy.get('label').contains('Month').next('input').type('4');
      cy.get('label').contains('Year').next('input').type('2022');

      cy.get('button').contains('Yes, accept').click();

      cy.get('@updateDocumentState').its('request.body').should('deep.equal', {
        state: 'APPROVED',
        userUpdatedBy: 'test@hackney.gov.uk',
        staffSelectedDocumentTypeId: 'passport-scan',
        validUntil: '30-4-2022',
      });
    });

    cy.get('[role=dialog]').should('not.exist');
    cy.contains('button', 'Accept').should('not.exist');
    cy.contains('button', 'Request new file').should('not.exist');
  });

  it('can reject the document', () => {
    cy.get('a').contains('Proof of ID').click();
    cy.contains('h1', 'Namey McNameProof of ID');
    cy.get('button').contains('Request new file').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('h2').should('contain', 'Request a new file');

      cy.get('span').should('contain', 'For example, text not legible');
      cy.get('textarea').type('some rejection reason');
      cy.get('button').contains('Request new file').click();
    });
    cy.get('@updateDocumentState').its('request.body').should('deep.equal', {
      state: 'REJECTED',
      userUpdatedBy: 'test@hackney.gov.uk',
      rejectionReason: 'some rejection reason',
    });
  });

  it('can view approved documents', () => {
    cy.get('.reviewed a').contains('Proof of ID').click();
    cy.get('button').contains('Copy page URL');
    cy.get('h2').should('contain', 'History');
    cy.get('table').should('contain', 'Namey McName');
    cy.get('table').should('contain', 'Accepted this file as Passport');
    cy.get('table').should('contain', '15 January 2021');
  });

  it('can view rejected documents', () => {
    cy.get('.rejected a').contains('Proof of ID').click();
    cy.get('h2').should('contain', 'History');
    cy.get('.lbh-rejection-reason').should('contain', 'some rejection reason');
  });

  it('can view page warning for document with expired claim', () => {
    cy.get('.reviewed a').eq(1).contains('Proof of ID').click();
    cy.get('section').contains('This document is no longer valid');
  });
});

describe('When a user inputs a validity date that is in the past', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('PATCH', '/api/evidence/document_submissions', (req) => {
      req.responseTimeout = 5000;
      req.reply((res) => {
        res.send(400, 'The date cannot be in the past.');
      });
    }).as('acceptInvalidDate');

    cy.visit(`http://localhost:3000/teams/2/dashboard`);

    cy.get('a').contains('Namey McName').click();
    cy.contains('h1', 'Namey McName');
  });

  it('shows an error', () => {
    //arrange
    cy.get('a').contains('Proof of ID').click();
    cy.get('button').contains('Accept').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('#staffSelectedDocumentTypeId-passport-scan').click();

      cy.get('label').contains('Day').next('input').type('01');
      cy.get('label').contains('Month').next('input').type('01');
      cy.get('label').contains('Year').next('input').type('1992');

      //act
      cy.get('button').contains('Yes, accept').click();

      //assert
      cy.get('fieldset>span')
        .eq(0)
        .should('contain', 'The date cannot be in the past.');
    });
  });
});

describe('Can view and manage evidence with HEIC document', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('PATCH', '/api/evidence/document_submissions', (req) => {
      const body = {
        ...dsFixtureHeic,
        id: 456,
        state: req.body.state,
        staffSelectedDocumentTypeId: req.body.staffSelectedDocumentTypeId,
      };
      console.log(body);
      req.reply((res) => {
        res.send(200, body);
      });
    }).as('updateDocumentStateHeic');

    cy.visit(`http://localhost:3000/teams/2/dashboard`);
    cy.injectAxe();

    cy.get('a').contains('Namey McName').click();
    cy.contains('h1', 'Namey McName');
  });

  it('lets you see an heic document detail page with actions and information', () => {
    cy.get('.toReview a').eq(2).contains('Proof of ID').click();

    cy.contains('h1', 'Namey McNameProof of ID');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');
    cy.get('h2').should('contain', 'Preview');
    cy.get('svg[class="icon-loading"]').should('be.visible');
    cy.contains('HEIC');
    cy.contains('9.8 KB');
    cy.get('[data-cy="heic-image"]')
      .should('have.attr', 'src')
      .then((src) => expect(src).to.have.length(0));
    cy.wait(5000);
    cy.get('[data-cy="heic-image"]')
      .should('have.attr', 'src')
      .then((src) => expect(src).have.length.greaterThan(0));
    cy.get('[data-cy="heic-image"]').should('have.attr', 'alt', 'Proof of ID');
    cy.get('svg[class="icon-loading]').should('not.exist');
  });
});

export {};
