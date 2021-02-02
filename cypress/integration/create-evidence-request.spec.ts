describe('Create evidence requests', () => {
  beforeEach(() => {
    cy.login();

    cy.intercept('/api/evidence/document_types', {
      fixture: 'document-types-response.json',
    });
    cy.intercept('GET', '/api/evidence/evidence_requests', {
      fixture: 'evidence-request-response',
    });
    cy.intercept('POST', '/api/evidence/evidence_requests', {
      fixture: 'evidence_requests/id',
    }).as('postEvidenceRequests');

    cy.visit(`http://localhost:3000/dashboard`);
    cy.injectAxe();
  });

  it('Has no detectable accessibility issues', () => {
    cy.checkA11y();
  });

  it('User can fill out new request form', () => {
    cy.get('nav').contains('Requests').click();
    cy.get('h1').should('contain', 'Pending requests');

    cy.get('a').contains('New request').click();

    cy.get('h1').should('contain', 'Make a new request');

    cy.get('label').contains('Name').next('input').type('Frodo Baggins');
    cy.get('label').contains('Email').next('input').type('frodo@bagend.com');
    cy.get('label')
      .contains('Mobile phone number')
      .next('input')
      .type('+447123456780');

    cy.get('label').contains('Send request by SMS').click();
    cy.get('label').contains('Driving license').click();

    cy.get('button').contains('Send request').click();

    cy.get('[role=dialog]').within(() => {
      cy.contains("You're about to send a request by SMS");
      cy.get('li').contains('Frodo Baggins');
      cy.get('li').contains('frodo@bagend.com');
      cy.get('li').contains('+447123456780');
      cy.get('li').contains('driving license');

      cy.get('button').contains('Yes, send this request').click();
    });

    cy.wait('@postEvidenceRequests');

    cy.get('body').contains('Thanks!');
  });
});

export {};
