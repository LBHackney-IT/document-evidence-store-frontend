import { defaultUser } from 'cypress/support/commands';

describe('authentication', () => {
  context('when logged out', () => {
    it('protected pages redirect to login', () => {
      cy.visit('/requests/new?test=param');
      cy.url().should(
        'eq',
        `${
          Cypress.config().baseUrl
        }/login?redirect=%2Frequests%2Fnew%3Ftest%3Dparam`
      );
    });

    it('handles client side routing', () => {
      cy.visit('/login');
      cy.window().then((win) => {
        win.next.router.push('/requests/new?test=param');
        cy.url().should(
          'eq',
          `${
            Cypress.config().baseUrl
          }/login?redirect=%2Frequests%2Fnew%3Ftest%3Dparam`
        );
      });
    });
  });

  context('when logged in without the correct google group', () => {
    it('shows access denied', () => {
      const user = { ...defaultUser };
      user.groups = ['some-other-group'];
      cy.login(user);

      cy.visit('/requests/new');

      cy.get('h1').should('contain.text', 'Access denied');
    });
  });
});

export {};