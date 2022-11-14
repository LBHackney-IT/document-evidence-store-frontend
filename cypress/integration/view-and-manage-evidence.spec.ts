import dsFixture from '../../cypress/fixtures/document_submissions/get-png.json';
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

      req.reply((res) => {
        res.send(200, body);
      });
    }).as('updateDocumentState');

    cy.visit(`http://localhost:3000/teams/2/dashboard`);
    cy.injectAxe();

    cy.get('a').contains('Namey McName').click();
    cy.contains('h1', 'Namey McName');
  });

  const dateInvalidErrorMessage = 'Please enter a valid date';
  it('pages have no detectable accessibility issues', () => {
    cy.checkA11y({
      exclude: ['table'],
    });
    cy.get('a').contains('Proof of ID').click();
    cy.contains('h1', 'Namey McNameProof of ID');
    cy.checkA11y();
  });

  it('checks if resident information is displayed correctly in a table', () => {
    cy.get('tbody').within(() => {
      cy.get('tr')
        .eq(0)
        .should('contain.text', 'Name')
        .and('contain.text', 'Namey McName');
      cy.get('tr')
        .eq(1)
        .should('contain.text', 'Mobile number')
        .and('contain.text', '+447123456780');
      cy.get('tr')
        .eq(2)
        .should('contain.text', 'Email address')
        .and('contain.text', 'frodo@bagend.com');
    });
  });

  it('has breadcrumbs on resident page', () => {
    cy.get('[data-testid="search-page"]').should('contain.text', 'Search page');
    cy.get('[data-testid="search-page"]').click();
    cy.get('a').contains('Namey McName');
    cy.get('h1').contains('Browse residents');
  });

  it('shows all documents tab and document submissions in all states', () => {
    cy.get('h1').should('contain', 'Namey McName');
    cy.get('h2').should('contain', 'All documents');

    cy.get('section[id="all-documents"] table')
      .eq(0)
      .should('contain', 'PENDING REVIEW')
      .and('contain.text', 'Proof of ID(PNG 24.7 KB)')
      .and(
        'contain.text',
        'Date uploaded: 10:23 am 14 January 2021 (last year)'
      )
      .and('contain.text', 'reason number 1')
      .and('contain.text', 'Requested by test1@hackney.gov.uk');

    cy.get('section[id="all-documents"] table')
      .eq(3)
      .should('contain', 'APPROVED')
      .and('contain.text', 'Passport(PNG 24.7 KB)')
      .and(
        'contain.text',
        'Date uploaded: 10:23 am 25 December 2020 (2 years ago)'
      )
      .and('contain.text', 'reason number 1')
      .and('contain.text', 'Requested by test1@hackney.gov.uk');

    cy.get('section[id="all-documents"] table')
      .eq(5)
      .should('contain', 'REJECTED')
      .and('contain.text', 'Proof of ID(PNG 24.7 KB)')
      .and(
        'contain.text',
        'Date uploaded: 10:23 am 30 December 2020 (2 years ago)'
      )
      .and('contain.text', 'reason number 2')
      .and('contain.text', 'Requested by test2@hackney.gov.uk');

    cy.get('section[id="all-documents"] table')
      .eq(6)
      .should('contain', 'AWAITING SUBMISSION')
      .and('contain.text', 'Passport')
      .and(
        'contain.text',
        'Date requested: 3:34 pm 30 November 2020 (2 years ago)'
      )
      .and('contain.text', 'reason number 1')
      .and('contain.text', 'Requested by test1@hackney.gov.uk');

    cy.get('section[id="all-documents"] table').should('have.length', 5);
  });

  it('clicks through to the tab and shows the correct date format', () => {
    cy.get('a.govuk-tabs__tab[href*="awaiting-submission"]').click();
    cy.get('section[id="awaiting-submission"] p').should(
      'contain',
      '3:34 pm 30 November 2020 (2 years ago)'
    );

    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"] p').should(
      'contain',
      '10:23 am 14 January 2021 (last year)'
    );

    cy.get('a.govuk-tabs__tab[href*="approved"]').click();
    cy.get('section[id="approved"] p').should(
      'contain',
      '10:23 am 25 December 2020 (2 years ago)'
    );

    cy.get('a.govuk-tabs__tab[href*="rejected"]').click();
    cy.get('section[id="rejected"] p').should(
      'contain',
      '10:23 am 30 December 2020 (2 years ago)'
    );
  });

  it('can view all awaiting submission documents', () => {
    cy.get('a.govuk-tabs__tab[href*="awaiting-submission"]').click();
    cy.get('section[id="awaiting-submission"] table').should('have.length', 3);
  });

  it('can check the url contains residentId and teamId', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"]')
      .eq(0)
      .contains('Proof of ID')
      .click();
    cy.url()
      .should('include', '/teams/2')
      .and('include', 'residents/3fa85f64-5717-4562-b3fc-2c963f66afb6');
  });

  it('can view pending review documents', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"] table').should('have.length', 3);
    cy.get('section[id="pending-review"]')
      .eq(0)
      .contains('Proof of ID')
      .click();
  });

  it('can view approved documents', () => {
    cy.get('a.govuk-tabs__tab[href*="approved"]').click();
    cy.get('section[id="approved"] table').should('have.length', 2);
    cy.get('section[id="approved"]').eq(0).contains('Passport').click();
  });

  it('can view rejected documents', () => {
    cy.get('a.govuk-tabs__tab[href*="rejected"]').click();
    cy.get('section[id="rejected"] table').should('have.length', 1);
    cy.get('section[id="rejected"]').eq(0).contains('Proof of ID').click();

    cy.get('h2').should('contain', 'History');
    cy.get('.lbh-rejection-reason').should('contain', 'some rejection reason');
  });

  it('lets you see an image document detail page with actions and information', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]')
      .should('contain', 'Pending review')
      .click();
    cy.get('section[id="pending-review"]')
      .eq(0)
      .contains('Proof of ID')
      .click();

    cy.contains('h1', 'Namey McNameProof of ID');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.get('h2').should('contain', 'Preview');
    cy.get('img').should('be.visible');

    cy.get('figure').should('contain', 'PNG');
    cy.get('figure').should('contain', '24.7 KB');

    cy.get('h2').should('contain', 'History');
    cy.get('table')
      .should('contain', 'Valid until')
      .and('contain', '29 January 2121')
      .and('contain', 'Retention expires')
      .and('contain', '14 April 2021');
  });

  it('lets you see an PDF document detail page with actions and information', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"] a')
      .eq(1)
      .contains('Proof of ID')
      .click();

    cy.contains('h1', 'Namey McNameProof of ID');

    cy.get('button').should('contain', 'Accept');
    cy.get('button').should('contain', 'Request new file');

    cy.get('h2').should('contain', 'Preview');
    cy.get('iframe');

    cy.contains('PDF');
    cy.contains('54.0 KB');
  });

  it('can approve the document', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"]')
      .eq(0)
      .contains('Proof of ID')
      .click();

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

  it('can throw error when entering an incorrect date when approving document', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"]')
      .eq(0)
      .contains('Proof of ID')
      .click();

    cy.contains('h1', 'Namey McNameProof of ID');
    cy.get('button').contains('Accept').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('h2').should(
        'contain',
        'Are you sure you want to accept this file?'
      );

      cy.get('#staffSelectedDocumentTypeId-passport-scan').click();

      cy.get('label').contains('Day').next('input').type('1234');
      cy.get('label').contains('Month').next('input').type('5678');
      cy.get('label').contains('Year').next('input').type('9101');

      cy.get('[data-testid="error-invalid-date"]').contains(
        dateInvalidErrorMessage
      );
    });
  });

  it('can approve document if date entered then removed', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"]')
      .eq(0)
      .contains('Proof of ID')
      .click();

    cy.contains('h1', 'Namey McNameProof of ID');
    cy.get('button').contains('Accept').click();

    cy.get('[role=dialog]').within(() => {
      cy.get('h2').should(
        'contain',
        'Are you sure you want to accept this file?'
      );

      cy.get('#staffSelectedDocumentTypeId-passport-scan').click();

      cy.get('label').contains('Day').next('input').type('1234');
      cy.get('label').contains('Month').next('input').type('5678');
      cy.get('label').contains('Year').next('input').type('9101');

      cy.get('label').contains('Day').next('input').clear();
      cy.get('label').contains('Month').next('input').clear();
      cy.get('label').contains('Year').next('input').clear();

      cy.get('[data-testid="error-invalid-date"]').should('not.contain.text');

      cy.get('button').contains('Yes, accept').click();
      cy.wait('@updateDocumentState');
      cy.get('@updateDocumentState').its('request.body').should('deep.equal', {
        state: 'APPROVED',
        userUpdatedBy: 'test@hackney.gov.uk',
        staffSelectedDocumentTypeId: 'passport-scan',
      });
    });

    cy.get('[role=dialog]').should('not.exist');
    cy.contains('button', 'Accept').should('not.exist');
    cy.contains('button', 'Request new file').should('not.exist');
  });

  it('can reject the document', () => {
    cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
    cy.get('section[id="pending-review"]')
      .eq(0)
      .contains('Proof of ID')
      .click();

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

  it('can view page warning for document with expired claim', () => {
    cy.get('a.govuk-tabs__tab[href*="approved"]').click();
    cy.get('section[id="approved"] a').eq(1).contains('Passport').click();

    cy.get('[data-testid="page-warning"]').contains(
      'This document is no longer valid'
    );
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

    it('shows an error', async () => {
      //arrange
      cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
      cy.get('section[id="pending-review"')
        .eq(0)
        .contains('Proof of ID')
        .click();

      cy.get('button').contains('Accept').click();

      cy.get('[role=dialog]').within(() => {
        cy.get('#staffSelectedDocumentTypeId-passport-scan').click();

        cy.get('label').contains('Day').next('input').type('01');
        cy.get('label').contains('Month').next('input').type('01');
        cy.get('label').contains('Year').next('input').type('1992');

        //act
        cy.get('[data-testid="accept"]').click();

        //assert

        cy.wait('@acceptInvalidDate');
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
        req.reply((res) => {
          res.send(200, body);
        });
      });

      cy.visit(`http://localhost:3000/teams/2/dashboard`);
      cy.injectAxe();

      cy.get('a').contains('Namey McName').click();
      cy.contains('h1', 'Namey McName');
    });

    it('lets you see an heic document detail page with actions and information', () => {
      cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
      cy.get('section[id="pending-review"] a')
        .eq(2)
        .contains('Proof of ID')
        .click();

      cy.contains('h1', 'Namey McNameProof of ID');

      cy.get('button').should('contain', 'Accept');
      cy.get('button').should('contain', 'Request new file');
      cy.get('h2').should('contain', 'Preview');
      cy.get('svg[class="icon-loading"]').should('be.visible');
      cy.get('figure').should('contain', 'HEIC');
      cy.get('figure').should('contain', '9.8 KB');
      cy.get('[data-testid="conversion-image"]')
        .should('have.attr', 'src')
        .then((src) => expect(src).to.have.length(0));
      cy.wait(5000);
      cy.get('[data-testid="conversion-image"]')
        .should('have.attr', 'src')
        .then((src) => expect(src).have.length.greaterThan(0));
      cy.get('[data-testid="conversion-image"]').should(
        'have.attr',
        'alt',
        'Proof of ID'
      );
      cy.get('svg[class="icon-loading]').should('not.exist');
    });
  });

  describe('Can rotate a document', () => {
    beforeEach(() => {
      cy.login();

      cy.intercept('PATCH', '/api/evidence/document_submissions', (req) => {
        const body = {
          ...dsFixture,
          id: 123,
          state: req.body.state,
          staffSelectedDocumentTypeId: req.body.staffSelectedDocumentTypeId,
        };

        req.reply((res) => {
          res.send(200, body);
        });
      }).as('updateDocumentState');

      cy.visit(`http://localhost:3000/teams/2/dashboard`);
      cy.injectAxe();

      cy.get('a').contains('Namey McName').click();
      cy.contains('h1', 'Namey McName');
    });

    it('allows image rotation', () => {
      cy.get('a.govuk-tabs__tab[href*="pending-review"]').click();
      cy.get('section[id="pending-review"]')
        .eq(0)
        .contains('Proof of ID')
        .click();
      cy.get('[data-testid="rotate-button"]').click({ force: true });
      cy.get('[data-testid="default-image"]')
        .should('have.attr', 'class')
        .and('contains', 'rotated90');

      cy.get('[data-testid="rotate-button"]').click({ force: true });
      cy.get('[data-testid="default-image"]')
        .should('have.attr', 'class')
        .and('contains', 'rotated180');

      cy.get('[data-testid="rotate-button"]').click({ force: true });
      cy.get('[data-testid="default-image"]')
        .should('have.attr', 'class')
        .and('contains', 'rotated270');

      cy.get('[data-testid="rotate-button"]').click({ force: true });
      cy.get('[data-testid="default-image"]')
        .should('have.attr', 'class')
        .and('contains', 'rotated360');
    });
  });
});
export {};
